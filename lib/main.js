// -*- coding: utf-8-unix -*-
enchant();
var gameX = 640;
var gameY = 960;
var game;

function createTitleScene() {
    var scene = new Scene();
    var label = new Label('touch to start game');
    label.x = 0;
    label.y = 0;
    scene.addChild(label);
    scene.backgroundColor = 'rgba(128, 128, 255, 1)';
    scene.addEventListener(Event.TOUCH_END, function(e) {
        game.replaceScene(createGameScene());
    });
    return scene;
};

var Bear = Class.create(Sprite, {
    initialize: function(x, y) {
	Sprite.call(this, 32, 32);
	this.image = game.assets['images/chara1.png'];
	this.tx = this.x = x;
	this.ty = this.y = y;
	this.frame = 0;
	this.socket = io.connect('http://localhost:8080');
	this.socket.emit('bear', { my: 'data ' + this.x + ', ' + this.y });
    },
    onenterframe: function() {
	slow = 60;
	this.x += (this.tx - this.x) / slow;
	this.y += (this.ty - this.y) / slow;
    }
});

function createGameScene() {
    var scene = new Scene();
    scene.backgroundColor = 'rgba(128, 255, 128, 1)';
    var bear = new Bear(32, 32);
    scene.addChild(bear);
    scene.addEventListener(enchant.Event.TOUCH_END, function(event) {
	bear.tx = event.x;
	bear.ty = event.y;
    });
    return scene;
};

window.onload = function() {
    game = new Game(gameX, gameY);
    game.preload('images/chara1.png');
    game.replaceScene(createTitleScene());
    game.fps = 15;
    game.start();
};
