(function($){
  $.usersPage = function(options) {
    var users = {
      options: $.extend({}, options),
      storage: {},
      ext: '.json',
      targetObject: null,
      clear: function() {
        users.storage = {};
      },
      find: function(id) {
        var user = $.grep(users.list(), function(c){ return c.id == id; });
        if (user.length === 1) {
          return user[0];
        }
        return false;
      },
      findIndex: function(id) {
        var index = $.map(users.list(), function(user, index) {
          if (user.id == id) {
            return index;
          }
        });
        if (index.length === 1) {
          return index[0];
        }
        return false;
      },
      buildTableBody: function() {
        var tbody = $('#usersTable > tbody');
        tbody.empty();
        $.each(users.list(), function(key, user){
          tbody.append(users.buildTableRow(user));
        });
      },
      buildTableRow: function(user) {
        var company = window.companies.find(user.company_id);
        //
        var tr = $('<tr/>').append(
          $('<td/>', { text: user.name })
        ).append(
          $('<td/>', { text: user.email })
        ).append(
          $('<td/>', { text: company.name })
        ).append(
          $('<td/>').append(
            $('<button/>', {
              type: "button",
              class: "btn btn-primary btn-xs",
              text: "Edit"
            }).click(function(){ users.updateShow(user.id); })
          ).append(
            $('<button/>', {
              type: "button",
              class: "btn btn-primary btn-xs",
              text: "Delete"
            }).click(function(){ users.deleteShow(user.id); })
          )
        );
        return tr;
      },
      list: function() {
        if (!users.storage.list) {
          $.ajax({
            url: 'api/users.json',
            async: false
          }).done(function(data) {
            users.storage.list = data;
          });
        }
        return users.storage.list;
      },
      create: function(user) {
        $.ajax({
          url: 'api/users.json',
          type: 'POST',
          data: {
            company_id: user.company_id,
            name: user.name,
            email: user.email
          },
          async: false
        }).done(function(response) {
          user.id = response.id;
          users.storage.list.push(user);
        });
        return user;
      },
      createShow: function() {
        $('#modalUsersTitle').text('Add user');
        $('#usersId').val('');
        $('#usersName').val('');
        $('#usersEmail').val('');
        $('#usersCompany').replaceWith(window.companies.buildSelect());
        $('#formUsers .btn-primary').text('Add');
        users.targetObject = null;
        $('#modalUsers').modal('show');
      },
      update: function(user) {
        $.ajax({
          url: 'api/users/' + user.id + this.ext,
          type: 'PUT',
          data: {
            company_id: user.company_id,
            name: user.name,
            email: user.email
          },
          async: false
        }).done(function(response) {
          var index = users.findIndex(user.id);
          users.storage.list[index] = user;
        });
        return user;
      },
      updateShow: function(id) {
        var user = users.find(id);
        $('#modalUsersTitle').text('Edit user');
        $('#usersId').val(user.id);
        $('#usersName').val(user.name);
        $('#usersEmail').val(user.email);
        $('#usersCompany').replaceWith(window.companies.buildSelect().val(user.company_id));
        $('#formUsers .btn-primary').text('Save');
        users.targetObject = id;
        $('#modalUsers').modal('show');
      },
      delete: function(id) {
        var data = this.storage;
        $.ajax({
          url: 'api/users/' + id + this.ext,
          type: 'DELETE',
          async: false,
          success: function() {
            var index = users.findIndex(id);
            data.list.splice(index, 1);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed to delete user."); 
          }
        });
      },
      deleteHandler: function(e) {
        e.preventDefault();
        var id = users.targetObject;
        users.delete(id);
        $('#modalUsersDelete').modal('hide');
        users.buildTableBody();
      },
      deleteShow: function(id) {
        $('#modalUsersDelete').modal('show');
        users.targetObject = id;
      },
      showModalUsers: function(e) {
        var data = $(e.relatedTarget).data();

        if (data.id) {
          users.updateShow();
        } else {
          users.createShow();
        }
      },
      saveUserHandler: function (form) {
        var user = {};
        form = $(form);
        $.each(form.serializeArray(), function(_, kv) {
          user[kv.name] = kv.value;
        });
        if (users.targetObject) {
          user.id = users.targetObject;
          users.update(user);
        } else {
          users.create(user);
        }
        $('#modalUsers').modal('hide');
        users.buildTableBody();
      }
    };
    return users;
  };
})(jQuery,this);