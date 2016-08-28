var ref = require('ref');
var ffi = require('ffi');

var GtkObjectPointer = ref.refType(ref.types.void);
var FunctionPointer = ffi.Function(ref.types.void, []);

var gtk = ffi.Library('libgtk-3', {
    gtk_application_new: [GtkObjectPointer, ['string', 'int']],
    g_signal_connect_data: ['void', [GtkObjectPointer, 'string', FunctionPointer, 'void', 'void', 'int']],
    g_application_run: ['int', [GtkObjectPointer, 'int', 'string']],
    g_object_unref: ['void', [GtkObjectPointer]],

    gtk_widget_show_all: ['void', [GtkObjectPointer]],
    gtk_application_window_new: [GtkObjectPointer, [GtkObjectPointer]]
});

var activateCallback = ffi.Callback('void', [], function() {
    var window = gtk.gtk_application_window_new(app);
    gtk.gtk_widget_show_all(window);

    var destroyCallback = ffi.Callback('void', [], function() {
        console.log('window destroyed');
    });

    // this code will cause a segfault AFTER it is called
    gtk.g_signal_connect_data(window, 'destroy', destroyCallback, null, null, 0);

    console.log('activate');
});

var app = gtk.gtk_application_new('com.github.ffiissue', 0);
gtk.g_signal_connect_data(app, 'activate', activateCallback, null, null, 0);
var status = gtk.g_application_run(app, 0, '');

console.log('process exited with', status);
