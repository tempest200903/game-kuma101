// -*- coding: utf-8-unix -*-

enchant();
var gameX = 640;
var gameY = 960;
var game;
var socket;

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
    initialize: function(x, y, spriteframe, bearName) {
	Sprite.call(this, 32, 32);
	this.bearName = bearName;
	this.image = game.assets['images/chara1.png'];
	this.tx = this.x = x;
	this.ty = this.y = y;
	this.frame = spriteframe;
	var bearThis = this;
	socket.on('bear.server', function (data) {
	    if(false){
		console.log('bear.server { ' +
			    'bearName: ' + data.bearName +
			    ', x: ' + data.x +
			    ', y: ' + data.y +
			    ', tx: ' + data.tx +
			    ', ty: ' + data.ty +
			    '}');
	    }
	    if(this.bearName == data.bearName){
		this.tx = data.tx;
		this.ty = data.ty;
		bearThis.moveTo(data.x, data.y);
	    }
	});
	socket.emit('bear.initialize', {
	    bearName: this.bearName,
	    x: this.x,
	    y: this.y
	});
    },
    onenterframe: function() {
	slow = 60;
	this.x += (this.tx - this.x) / slow;
	this.y += (this.ty - this.y) / slow;
	socket.emit('bear.onenterframe', {
	    bearName: this.bearName,
	    x: this.x,
	    y: this.y,
	    tx: this.tx,
	    ty: this.ty
	});
    },
    setTarget: function(ex, ey) {
	this.tx = ex;
	this.ty = ey;
    }
});

function createGameScene() {
    var scene = new Scene();
    scene.backgroundColor = 'rgba(128, 255, 128, 1)';

    var label = new Label();
    scene.addEventListener(enchant.Event.ENTER_FRAME, function(event) {
	label.text = 'frame: ' + game.frame;
    });
    scene.addChild(label);

    var time = new Date().getTime();
    var bearName = 'Bear(' + time + ')';
    socket.emit('createGameScene', { bearName: bearName });
    socket.on('addBear', function (data) {
	console.log('addBear { ' +
		    ' x: ' + data.x + 
		    ' y: ' + data.y + 
		    ' spriteframe: ' + data.spriteframe +
		    ' bearName: ' + data.bearName + 
		    ' } ');
	var bear = new Bear(data.x, data.y, data.spriteframe, data.bearName);
	scene.addChild(bear);
	if(bearName == data.bearName){
	    scene.addEventListener(enchant.Event.TOUCH_END, function(event) {
		bear.setTarget(event.x, event.y);
	    });
	}
    });

    return scene;
};

window.onload = function() {
    socket = io.connect('http://localhost:8080');
    game = new Game(gameX, gameY);
    game.preload('images/chara1.png');
    game.replaceScene(createTitleScene());
    game.fps = 5;
    game.start();
};
