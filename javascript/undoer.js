//
// undoer
//
// Copyright (c) 2013, Saevon
// Licensed under the Apache 2.0 License.
//

var undoer = {};

undoer.UndoHistory = {
    history: [],
    index: -1,

    /*
     * manager.save(memento)
     *     Saves the given memento into the queue
     *
     * manager.save(owner, state)
     *     Saves the given owners state as a new memento
     */
    save: function save(memento, state) {
        if (state !== null) {
            memento = undoer.memento(memento, state);
        }
        
        // TODO: What if you'd already undone?
        //   Normally this would overwrite (and wipe all future history)
        //   Alternatively that could be a flag (error_on_overwrite or force_overwrite)
        this.history.push(memento);

        return this;
    },

    /*
     * Returns whether there is an operation to undo
     *  Can be used to enable/disable undo button
     */
    can_undo: function can_undo() {
        // -1 Means there are no states ahead of us
        return (this.index >= 0);
    },

    /*
     * Returns whether there is an operation to redo
     *  Can be used to enable/disable undo button
     */
    can_redo: function can_redo() {
        // The index points to the current "undoeable"
        // .: if we point to the last item we cannot redo
        return (this.index < this.history.length - 1);
    },

    /*
     * Undoes the next operation (if any)
     */
    undo: function undo() {
        if (! this.can_undo()) {
            return this;
        }
        
        var memento = this.history[this.index];

        this.index -= 1;
        if (this.index < 0) {
            this.index = -1;
        }

        memento.undo();

        return this;
    },

    /*
     * Redoes the next operation (if any)
     */
    redo: function redo() {
        if (! this.can_redo()) {
            return this;
        }
        
        var memento = this.history[this.index + 1];

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
 *
 * Allows you to compose undo property to any Object
 */
undoer.UndoMixin = function UndoMixin(extension) {
    if (extension === null) {
        extension = {};
    }
    extension.prototype = undoer.Manager;

    return extension;
};


// Example Memento, overwrite the undo/redo commands with the right side-effects
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
