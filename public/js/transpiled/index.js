"use strict";

System.register(["shared.js"], function (_export, _context) {
    "use strict";

    var shared;


    function getIndexTemplate() {
        var template = document.querySelector('#item-row').innerHTML;
        return template;
    }

    function addItemToPage(item) {
        var template = getIndexTemplate();
        template = template.replace("{{name}}", item.name);
        template = template.replace("{{row-id}}", item.id);
        template = template.replace("{{item-id}}", item.id);
        document.getElementById("item-table").tBodies[0].innerHTML += template;

        console.log(item);
    }

    function saveNewitem() {
        var itemNameInput = document.getElementById("new-item-name");
        var itemName = itemNameInput.value;

        if (itemName) {
            hoodie.store('item').add({ name: itemName });
        }
        itemNameInput.value = "";
    }

    function deleteRow(deletedItem) {
        var row = document.getElementById(deletedItem.id);
        row.parentNode.removeChild(row);
    }

    function saveList() {
        var cost = document.getElementById("cost").value;

        hoodie.store('item').findAll().then(function (items) {
            console.log('cost = ', cost);
            console.log('items');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    console.log(item);
                }

                //store the list
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            hoodie.store('list').add({
                cost: cost,
                items: items
            });

            //delete the items
            console.log('deleting items');
            hoodie.store('item').remove(items).then(function () {
                //clear the table
                document.getElementById("item-table").tBodies[0].innerHTML = "";
                document.getElementById("cost").value = "";

                //notify the user
                var snackbarContainer = document.querySelector('#toast');
                snackbarContainer.MaterialSnackbar.showSnackbar({ message: 'List saved succesfully' });
            }).catch(function (error) {
                //notify the user
                var snackbarContainer = document.querySelector('#toast');
                snackbarContainer.MaterialSnackbar.showSnackbar({ message: error.message });
            });
        });
    }

    function deleteItem(itemId) {
        console.log('removing item with id ' + itemId);
        hoodie.store('item').remove(itemId);
    }

    return {
        setters: [function (_sharedJs) {
            shared = _sharedJs;
        }],
        execute: function () {
            ;hoodie.ready.then(function () {
                // all hoodie APIs are ready now
                shared.updateDOMLoginStatus();
                hoodie.store('item').on('add', addItemToPage);
                hoodie.store('item').on('remove', deleteRow);

                document.getElementById("add-item").addEventListener("click", saveNewitem);

                window.pageEvents = {
                    deleteItem: deleteItem,
                    saveList: saveList,
                    closeLogin: shared.closeLoginDialog,
                    showLogin: shared.showLoginDialog,
                    closeRegister: shared.closeRegisterDialog,
                    showRegister: shared.showRegisterDialog,
                    login: shared.login,
                    register: shared.register,
                    signout: shared.signOut
                };

                //retrieve items on the current list and display on the page
                hoodie.store('item').findAll().then(function (items) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var item = _step2.value;

                            addItemToPage(item);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                });
            });
        }
    };
});