var fabrikTableModule = new Class({

	initialize: function (id) {
		this.options = Object.extend({
			'mooversion': 1.1
		}, arguments[1] || {});

		window.addEvent('load', function (e) {
			this.blocks = $(id).getElements('.fabrik_block');
			if (window.getHeight() - 70 > this.blocks[1].getStyle("height").toInt() && this.blocks[1].getStyle("height").toInt() != 0) {
				var h = this.blocks[1].getStyle("height").toInt();
			} else {
				var h = window.getHeight() - 70;
			}
			this.winname = id + '_window';
			this.form = this.blocks[1].getElement('form');
			this.details = this.blocks[1].getElement('.fabrikDetails');
			this.o = {
				'id': this.winname,
				'width': 690,
				'height': h,
				'loadMethod': 'html',
				'title': 'Form',
				'maximizable': '1',
				'content': $$('.fabrik_block_col1')[0],
				'contentType': 'html'
			};
			var i = 0;
			var heights = {};
			var fx = new Fx.Elements(this.blocks, {
				wait: false,
				duration: 600,
				transition: Fx.Transitions.Quad.easeIn
			});
			$$('.fabrik_block').each(function (block) {
				heights[i] = block.getStyle("height").toInt();
				if (i != 0) {
					var o = {};
					o[i] = {
						height: 0
					}
					fx.set(o);
				}
				i++;
			});

			this.watchViewLinks();
			this.watchEditLinks();
			// $$$ is this kosher? $A copies an array, and seems to make [0] be
			// 'window' if you don't give it an array to copy.
			var links = $A([]);
			links.extend([this.blocks[0].getElement('.addbutton')]);
			links.extend(this.blocks[1].getElements('.button'));
			links.each(function (l) {
				if (l) {
					l.addEvent('click', function (e) {
						if (!$(this.winname)) {
							this.blocks[1].show();
							document.mochaDesktop.newWindow(this.o);
						} else {
							$(this.winname).show();
						}
						if (this.form) {
							this.form.show();
						}
						if (this.details) {
							this.details.hide();
						}
					}.bind(this));
				}
			}.bind(this));
		}.bind(this));
	},

	watchEditLinks: function () {
		// not sure why this is needed but if you edit and save a record then the
		// table doesnt attach the watchRows events to the new edit links (even
		// though it calls
		// watchRows() when it updates itself.
		this.blocks[0].getElements('.fabrik___rowlink').removeEvents();
		oTable.watchRows();
		this.blocks[0].getElements('.fabrik___rowlink').addEvent('click', function (event) {
			if (!$(this.winname)) {
				this.blocks[1].show();
				if (this.options.mooversion > 1.1) {
					var win = new MochaUI.Window(this.o);
				} else {
					document.mochaDesktop.newWindow(this.o);
				}
			} else {
				$(this.winname).show();
			}
			this.blocks[1].getElement('.fabrikForm').show();
			this.blocks[1].getElement('.fabrikDetails').hide();
			var e = new Event(event).stop();
		}.bind(this));
	},

	watchViewLinks: function () {
		this.blocks[0].getElements('.fabrik___viewrowlink').addEvent('click', function (event) {
			if (!$(this.winname)) {
				this.blocks[1].show();
				if (this.options.mooversion > 1.1) {
					var win = new MochaUI.Window(this.o);
				} else {
					document.mochaDesktop.newWindow(this.o);
				}
			} else {
				$(this.winname).show();
			}
			this.blocks[1].getElement('.fabrikForm').hide();
			this.blocks[1].getElement('.fabrikDetails').show();
			var e = new Event(event).stop();
		}.bind(this));
	}
});