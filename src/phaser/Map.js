import MapData from './defines/MapData'

class Map {
  layers = [];

  constructor(scene) {
    this.scene = scene;
  }

  creatTileMap() {
    this.createBaseTileMap();

    this.createGroupSheet(3, 3);
    this.createGroupSheet(12, 3);
    this.createGroupSheet(3, 12);
    this.createGroupSheet(12, 12);
  }

  getMapWidth() {
    return MapData.tileSize * MapData.column;
  }

  getMapHeight() {
    return MapData.tileSize * MapData.row;
  }
  
  createBaseTileMap() {
    const tileMap = [];

    for (let i = 0; i < MapData.row; i++) {
      const row = [];
      for (let j = 0; j < MapData.column; j++) {
        if (i === 0) {
          if (j === 0) {
            row.push(0);
          } else if (j === MapData.column - 1) {
            row.push(2);
          } else {
            row.push(1);
          }
        } else if (i === MapData.row - 1) {
          if (j === 0) {
            row.push(12);
          } else if (j === MapData.column - 1) {
            row.push(14);
          } else {
            row.push(13);
          }
        } else {
          if (j === 0) {
            row.push(6);
          } else if (j === MapData.column - 1) {
            row.push(8);
          } else {
            row.push(7);
          }
        }
      }
      tileMap.push(row);
    }

    this.addLayer(tileMap,0,0);
  }

  addLayer(tileMapData,x,y) {
    const tileMap = this.scene.make.tilemap({
      data: tileMapData,
      tileWidth: MapData.tileSize,
      tileHeight: MapData.tileSize,
    });
    tileMap.addTilesetImage('tiles');
    const newGroupLayer = tileMap.createLayer(
      0,
      'tiles',
      MapData.tileSize * x,
      MapData.tileSize * y,
    );
    newGroupLayer.setName('layer_' + this.layers.length);
    this.layers.push(newGroupLayer);
  }

  createGroupSheet(x, y) {
    const group = [
      [3, 4, 4, 4, 4, 5],
      [9, 10, 10, 10, 10, 11],
      [9, 10, 10, 10, 10, 11],
      [9, 10, 10, 10, 10, 11],
      [9, 10, 10, 10, 10, 11],
      [9, 10, 10, 10, 10, 11],
      [15, 16, 16, 16, 16, 17],
    ];
    this.addLayer(group,x,y);

    this.scene.m_table0 = this.scene.add
      .sprite(
        MapData.tileSize * (x + 1) - MapData.tileSize / 2,
        MapData.tileSize * (y - 1),
        'table',
      )
      .setOrigin(0, 0);
      this.scene.m_table1 = this.scene.add
      .sprite(
        MapData.tileSize * (x + 1) - MapData.tileSize / 2,
        MapData.tileSize * (y + 1),
        'table',
      )
      .setOrigin(0, 0);
      this.scene.m_table2 = this.scene.add
      .sprite(
        MapData.tileSize * (x + 1) - MapData.tileSize / 2,
        MapData.tileSize * (y + 3),
        'table',
      )
      .setOrigin(0, 0);
  }
};
export default Map;
