import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as bodyparser from 'body-parser';
import * as http from 'http';
import * as itf from './serialnumber';
import * as morgan from 'morgan';

let serialnumber: number;
let file: itf.Serialnumbers;
const app = express();
app.use(bodyparser.json());
app.use(morgan('tiny'));
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../serialnumbers.json')); });
app.post('/serialnumber', (req, res) => {
  serialnumber = parseInt(fs.readFileSync(path.join(__dirname, '../number')).toString());
  file = JSON.parse(fs.readFileSync(path.join(__dirname, '../serialnumbers.json')).toString());
  for (let i = 0; i < file.devices.length; i++) {
    if (file.devices[i].mac === req.body.mac) {
      return res.send(file.devices[i].number.toString() + '\n');
    }
  }
  serialnumber++;
  fs.writeFileSync(path.join(__dirname, '../number'), serialnumber);
  file.devices.push({ mac: req.body.mac, number: serialnumber });
  fs.writeFileSync(path.join(__dirname, '../serialnumbers.json'), JSON.stringify(file));
  return res.send(serialnumber.toString() + '\n');
});

const port = 2525;
const server = http.createServer(app).listen(port, () => {
  console.log('Server running on port ' + port);
});
