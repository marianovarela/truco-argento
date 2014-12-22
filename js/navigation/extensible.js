var extensible = function($rootScope) {
	var initial_handlers, log_action, log_creation, log_mode;
	log_mode = false;
	log_action = function(component, action) {
		if (log_mode) {
			console.log(component.identifier + ' handle ' + action);
		}
		return true;
	};
	log_creation = function(component, action) {
		if (log_mode) {
			console.log(component.identifier + ' creation ');
		}
		return true;
	};
	initial_handlers = function() {
		return {
			up : function(self) {
				console.log('up false' + self.identifier);
				return false;
			},
			down : function(self) {
				console.log('down false' + self.identifier);
				return false;
			},
			left : function(self) {
				console.log('left false' + self.identifier);
				return false;
			},
			right : function(self) {
				console.log('right false' + self.identifier);
				return false;
			},
			enter : function(self) {
				console.log('enter false' + self.identifier);
				return false;
			}
		};
	};
	return {
		create_basic : function(identifier) {
			log_creation(this);
			var on_change_callbacks = [];
			return {
				identifier : identifier,
				set_priority : function(priority) {
					this.priority = priority;
					return this;
				},
				on_change : function(callback) {
					on_change_callbacks.push(callback);
					return function() {
						item_index = on_change_callbacks.indexOf(callback);
						item_index > -1 && on_change_callbacks.splice(callback, 1);
					};
				},
				apply : function() {
					console.log('invoke apply on ' + this.identifier);
				},
				after_change : function() {
					var on_change_callback, _i, _len, _results;
					_results = [];
					for ( _i = 0, _len = on_change_callbacks.length; _i < _len; _i++) {
						on_change_callback = on_change_callbacks[_i];
						_results.push(on_change_callback(this));
					}
					return _results;
				},
				set_current_component : function(child_component, percolate_up) {
					if (this.current_component && (this.current_component !== child_component)) {
						this.current_component.set_not_active();
					}
					this.current_component = child_component;
					return this.current_component.set_active(percolate_up);
				},
				set_active_down_to_up : function(child_component, changed_child) {
					var hast_to_change;
					console.log('set_active_down_to_up ' + this.identifier);
					$('#' + this.identifier).addClass('hover');
					this.active = true;
					hast_to_change = this.current_component !== child_component;
					if (hast_to_change) {
						this.set_current_component(child_component);
					}
					if (changed_child) {
						if (hast_to_change) {
							return this.parent.set_active_down_to_up(this, true);
						} else {
							return this.apply();
						}
					}
				},
				set_active : function(percolate_up, skip_set_child) {
					var child_component;
					if (!this.active) {
						console.log('set active ' + this.identifier);

						$('#' + this.identifier).addClass('hover');
						this.active = true;
						if (!skip_set_child) {
							if (this.components.length > 0) {
								child_component = this.current_component || this.components[0];
								this.set_current_component(child_component);
							}
						}
					}
					if (percolate_up) {
						return this.parent.set_active_down_to_up(this, true);
					}
				},
				set_not_active : function() {
					$('#' + this.identifier).removeClass('hover');
					this.active = false;
					if (this.current_component) {
						return this.current_component.set_not_active();
					}
				},
				add : function(new_component, index) {
					var component, position, _i, _len, _ref;
					if (this.components.indexOf(new_component) > -1) {
						return console.error("trying to add same element twice [" + new_component.identifier + "]");
					} else {
						new_component.parent = this;
						new_component.priority = new_component.priority || index || 0;
						position = 0;
						_ref = this.components;
						for ( _i = 0, _len = _ref.length; _i < _len; _i++) {
							component = _ref[_i];
							if (component.priority < new_component.priority) {
								position += 1;
							}
						}
						this.components.splice(position, 0, new_component);
					}
					return this;
					
				},
				remove : function(component) {
					item_index = this.components.indexOf(component);
					item_index > -1 && this.components.splice(item_index, 1);
				},
				handle_on_selected : function(key) {
					return this.selected && this.selected.handle(key);
				},
				handle_inner : function(key) {
					var handler, has_handle;
					handler = this.handlers[key];
					has_handle = handler && handler(this);
					if (has_handle) {
						this.after_change();
						this.parent.set_active_down_to_up(this);
					}
					return has_handle;
				},
				handle_by_child : function(key) {
					return this.current_component && this.current_component.handle(key);
				},
				handle : function(key) {
					return this.handle_by_child(key) || this.handle_inner(key);
				},
				current_index : function() {
					return this.components.indexOf(this.current_component);
				},
				initialize : function() {
					this.components = [];
					this.handlers = initial_handlers();
					return this;
				},
				go_forward : function(amount) {
					var current_index, last_index;
					current_index = this.current_index();
					last_index = this.components.length - 1;
					if (current_index > -1 && (current_index + amount) <= last_index) {
						this.set_current_component(this.components[current_index + amount]);
						this.apply();
						return true;
					}
					return false;
				},
				go_back : function(amount) {
					var current_index;
					current_index = this.current_index();
					if (current_index > -1 && (current_index - amount) >= 0) {
						this.set_current_component(this.components[current_index - amount]);
						this.apply();
						return true;
					}
					return false;
				},
				previous : function(amount) {
					return this.go_back(1);
				},
				next : function() {
					return this.go_forward(1);
				}
			};
		},
		create_horizontal : function(identifier) {
			var instance = this.create_basic(identifier).initialize();
			instance.handlers.left = function(self) {
				return self.previous();
			};
			instance.handlers.right = function(self) {
				return self.next();
			};
			return instance;
		},
		create_vertical : function(identifier) {
			var instance = this.create_basic(identifier).initialize();
			instance.handlers.up = function(self) {
				return self.previous();
			};
			instance.handlers.down = function(self) {
				return self.next();
			};
			return instance;
		},
		create_leaf : function(identifier) {
			return {
				identifier : identifier,
				set_active : function() {
					console.log('set active ' +  this.identifier);
					$('#' + this.identifier).addClass('hover');
					return this.active = true;
				},
				set_not_active : function() {
					$('#' + this.identifier).removeClass('hover');
					return this.active = false;
				},
				handle : function(key) {
					if (key === 'enter') {
						console.log('handling enter ' + this.identifier);
						$('#' + this.identifier).get(0).click();
						return true;
					}
					return false;
				},
				set_navigable_link : function(navigable_link) {
					return this.navigable_link = navigable_link;
				},
				set_priority : function(priority) {
					this.priority = priority;
					return this;
				},
			};
		},
	};
}(this);
