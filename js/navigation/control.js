
component = {};

component.root = extensible.create_basic('root').initialize();

component.root.handle_inner = function(key) {
  console.log('handling ' + key);
  var audio = new Audio('audio/fail.mp3');
  audio.play();
};

component.root.set_active_down_to_up = function(child_component, changed_child) {
  
  console.log('set_active_down_to_up ' + this.identifier);
  this.set_current_component(child_component);
};

component.control = (function() {
  var Control, get_keycode, keycodes, listeners;
  listeners = [];
  keycodes = [
    {
      key: 'left',
      code: 37
    }, {
      key: 'up',
      code: 38
    }, {
      key: 'right',
      code: 39
    }, {
      key: 'down',
      code: 40
    }, {
      key: 'enter',
      code: 13
    }
  ];
  get_keycode = function(code) {
    var keycode, _i, _len;
    for (_i = 0, _len = keycodes.length; _i < _len; _i++) {
      keycode = keycodes[_i];
      if (keycode.code === code) {
        return keycode;
      }
    }
  };
  return Control = (function() {
    function Control() {}

    Control.subscribe = function(listener) {
      listeners.push(listener);
      return function() {
        return unsubscribe(listener);
      };
    };

    Control.unsubscribe = function(listener) {
      return _.remove(listeners, listener);
    };

    Control.initialize = function() {
      return document.onkeydown = function(event) {
        var keycode, listener, _i, _len;
        if (keycode = get_keycode(event.keyCode)) {
          for (_i = 0, _len = listeners.length; _i < _len; _i++) {
            listener = listeners[_i];
            listener.handle(keycode.key);
          }
          event.preventDefault();
          return false;
        }
      };
    };

    return Control;

  })();
})(this);

component.control.initialize();
component.control.subscribe(component.root);

component.main_left = extensible.create_vertical('main-left');

component.root
  .add(extensible.create_horizontal('main')
    .add(component.main_left.set_priority(0)
      .add(extensible.create_horizontal('mentira').set_priority(0)
        .add(extensible.create_leaf('Envido').set_priority(0))
        .add(extensible.create_leaf('RealEnvido').set_priority(1))
        .add(extensible.create_leaf('FaltaEnvido').set_priority(2))
      )
      .add(extensible.create_horizontal('rabon').set_priority(1)
        .add(extensible.create_leaf('IrAlMazo').set_priority(0))
        .add(extensible.create_leaf('Truco').set_priority(1))
        .add(extensible.create_leaf('reTruco').set_priority(2))
        .add(extensible.create_leaf('vale4').set_priority(3))
      )
      .add(extensible.create_horizontal('respuesta').set_priority(2)
        .add(extensible.create_leaf('Quiero').set_priority(0))
        .add(extensible.create_leaf('NoQuiero').set_priority(1))
        .add(extensible.create_leaf('Reiniciar-left').set_priority(2))
      )
      
    )
    .add(extensible.create_horizontal('main-center').set_priority(1)
    	.add(extensible.create_leaf('naipe-0').set_priority(0))
        .add(extensible.create_leaf('naipe-1').set_priority(1))
        .add(extensible.create_leaf('naipe-2').set_priority(2))
    )
    .add(extensible.create_horizontal('main-right').set_priority(2)
    	.add(extensible.create_leaf('opciones').set_priority(2))
    )
);


$(function(){component.main_left.set_active(true);});

console.log(component);