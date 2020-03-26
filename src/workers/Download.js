import fs from 'fs';
import cors from 'cors';
import _ from 'lodash';

export default function (app, env, io) {
  const retroPieConfig = require(`../config/retropie${env}.json`);
  const systems = require(`../config/systems.json`);

  app.get('/api/downloadfile/:system/:game', cors(), (req, res) => {
    let result = false;
    let error = null;

    const game   = req.params.game;
    const system = req.params.system;

    const systemIndex = _.findIndex(systems, (plt) => {
      return plt.name == system;
    });


    if (systemIndex > -1) {
        const fileName = req.body.file;
        const systemConfig = systems[systemIndex];
        const path = `${retroPieConfig.path}/${systemConfig.path}/${game}`;

	result = true;

        res.download(path);
    } else {
      error = 'Unknown system name';
    }

    if (error) {
      res.status(400);
    }

    res.send({ result, error });
  });
}
