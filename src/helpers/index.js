import systems from '../config/systems.json';

export function findSystemById(id) {
  const found = systems.filter(system => {
    return system.name == id;
  });

  return found ? found[0] : null;
}

export function findGameBySystem(system, game) {
  return { title : 'Zoop' };
}

export default {
  systems,
  findSystemById,
  findGameBySystem
}
