//
// undoer
//
// Copyright (c) 2013, Saevon
// Licensed under the Apache 2.0 License.
//

var undoer = {};

undoer.Manager = {
    history: [],
    index: 0,

    /*
     * manager.save(memento)
     *     Saves the given memento into the queue
     *
     * manager.save(owner, state)
     *     Saves the given owners state as a new memento
     */
    save: function save(memento, state) {
        if (state !== null) {
            memento = undoer.memento(memnto, state);
        }
        this.history.push(memento);

        return this;
    },

    /*
     * Returns whether there is an operatio to undo
     *  Can be used to enable/disable undo button
     */
    can_undo: function can_undo() {
        return (this.index <= 0);
    },

    /*
     * Returns whether there is an operatio to undo
     *  Can be used to enable/disable undo button
     */
    can_redo: function can_redo() {
        return (this.index >= this.history.length);
    },

    /*
     * Undoes the next operation (if any)
     */
    undo: function undo() {
        var memento = this.history[this.index];

        this.index -= 1;
        if (this.index <= 0) {
            this.index = 0;
        }

        memento.undo();

        return this;
    },

    /*
     * Redoes the next operation (if any)
     */
    redo: function redo() {
        var memento = this.history[this.index];

        this.index += 1;
        if (this.index >= this.history.length) {
            this.index = this.history.length - 1;
        }

        memento.redo();

        return this;
    }
};

/*
 * Creates a new manager, extending the given object..
 * a new object will be returned if none was supplied.
 */
undoer.new_manager = function new_manager(extension) {
    if (extension === null) {
        extension = {};
    }
    extension.prototype = undoer.Manager;

    return extension;
};


undoer.Memento = {
    state: null,
    owner: null,

    undo: function undo() {
        this.owner.undo(this);
    },
    redo: function redo() {
        this.owner.redo();
    },
    set: function set(owner, state) {
        this.state = state;
        this.owner = owner;
    }
};

/*
 * Used to create mementos
 */
undoer.memento = function memento(owner, state) {
    var item = new Memento();
    item.set(owner, state);

    return item;
};
