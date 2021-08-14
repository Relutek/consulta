var config = {
    type: Phaser.AUTO,
    width: 448,
    height: 496,
    backgroundColor: '#666666',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var socket = io()

socket.on('updatepos', function (msg) {
    ball.x = msg.x;
    ball.y = msg.y;
});

var game = new Phaser.Game(config)
var graphics;
var text;
var ball;

function preload() {}

function create() {
    graphics = this.add.graphics();
    ball = {
        x: 0,
        y: 0,
        r: 5
    };
    text = this.add.text(10, 10, '', {
        fill: '#00ff00'
    });
    this.input.on('pointermove', function (pointer) {
        text.setText([
            'x: ' + pointer.worldX,
            'y: ' + pointer.worldY,
            'isDown: ' + pointer.isDown,
        ]);
        socket.emit('xy', {
            x: pointer.worldX,
            y: pointer.worldY
        });
    });

}

function update() {
    graphics.clear();
    graphics.fillStyle(0x111111, 1);
    graphics.fillCircle(ball.x, ball.y, ball.r);
}