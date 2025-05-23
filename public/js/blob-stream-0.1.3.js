(function() {
  var exports;
  if (typeof window !== 'undefined') {
    exports = window;
  }

  function BlobStream() {
    this._chunks = [];
    this._listeners = {};
    this.writable = true;
    this.readable = true;
  }

  BlobStream.prototype = {
    write: function(data) {
      if (data) {
        this._chunks.push(data);
      }
      return true;
    },

    writeLine: function(str) {
      return this.write(str + '\n');
    },

    end: function(data) {
      if (data) {
        this.write(data);
      }
      this.writable = false;
      this._emit('finish');
      return this;
    },

    _emit: function(event) {
      var callbacks = this._listeners[event];
      if (!callbacks) return;
      
      // Create a copy of the callbacks array to avoid modification during iteration
      callbacks = callbacks.slice();
      
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].call(this);
      }
    },

    on: function(event, fn) {
      this._listeners[event] = this._listeners[event] || [];
      this._listeners[event].push(fn);
      return this;
    },

    once: function(event, fn) {
      var self = this;
      var wrapper = function() {
        fn.apply(self, arguments);
        self.removeListener(event, wrapper);
      };
      this.on(event, wrapper);
      return this;
    },

    removeListener: function(event, fn) {
      var callbacks = this._listeners[event];
      if (!callbacks) return this;
      
      var index = callbacks.indexOf(fn);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      return this;
    },

    emit: function(event) {
      var args = Array.prototype.slice.call(arguments, 1);
      var callbacks = this._listeners[event];
      if (!callbacks) return false;
      
      callbacks = callbacks.slice();
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].apply(this, args);
      }
      return true;
    },

    pipe: function(dest) {
      this.on('data', function(chunk) {
        dest.write(chunk);
      });

      this.on('end', function() {
        dest.end();
      });

      return dest;
    },

    toBlob: function(type) {
      type = type || 'application/pdf';
      
      // If the browser supports Blob constructor with type...
      try {
        return new Blob(this._chunks, { type: type });
      } catch (e) {
        // Otherwise...
        var bb = new BlobBuilder();
        for (var i = 0; i < this._chunks.length; i++) {
          bb.append(this._chunks[i]);
        }
        return bb.getBlob(type);
      }
    }
  };

  exports.blobStream = function() {
    return new BlobStream();
  };

})();
