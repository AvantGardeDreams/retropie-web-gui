import fs from 'fs';
import cors from 'cors';
import _ from 'lodash';

export default function (app, env, io) {
  const retroPieConfig = require(`../config/retropie${env}.json`);
  const systems = require(`../config/systems.json`);

  app.get('/api/:system/:game', cors(), (req, res) => {
    let result = false;
    let error = null;
    let cover = null;
    let details = null;
    let backdrop = null;
    let roms = []

    const game   = req.params.game;
    const system = req.params.system;

    const systemIndex = _.findIndex(systems, (plt) => {
      return plt.name == system;
    });


    if (systemIndex > -1) {
        const fileName = req.body.file;
        const systemConfig = systems[systemIndex];
        const path = `${retroPieConfig.path}/${systemConfig.path}/${game}/`;

        cover = 'data:image/png;base64,' + fs.readFileSync(path + "cover.png").toString('base64');
        details = "A vidja game"
        //backdrop = 'data:image/png;base64,' + fs.readFileSync(path + "backdrop.png").toString('base64');
        roms = []

	result = true;

    } else {
      error = 'Unknown system name';
    }

    if (error) {
      res.status(400);
    }

    res.send({ result, error, system, game, cover, details, backdrop, roms });
  });
}
