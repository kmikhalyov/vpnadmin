(function($){
  $.companiesPage = function(options) {
    var companies = {
      options: $.extend({}, options),
      storage: {},
      ext: '.json',
      targetObject: null,
      buildTableBody: function(param) {
        var tbody = $('#companiesList > tbody');
        tbody.empty();
         $.each(companies.list(), function(key, company){
            tbody.append(companies.buildTableRow(company));
        });
      },
      buildTableRow: function(company) {
        // Name
        var tr = $('<tr/>').append(
          $('<td/>', { text: company.name })
        );
        // Quota
        tr.append(
          $('<td/>', { text: formatBytes(company.quota) })
        );
        // Buttons
        tr.append(
          $('<td/>').append(
            $('<button/>', {
              type: "button",
              class: "btn btn-primary btn-xs",
              'data-toggle': "modal",
              'data-target': "#modalCompany",
              'data-id': company.id,
              text: "Edit"
            })
          ).append(
            $('<button/>', {
              type: "button",
              class: "btn btn-primary btn-xs",
              'data-toggle': "modal",
              'data-target': "#modalCompanyDelete",
              'data-id': company.id,
              text: "Delete"
            })
          )
        );
        return tr;
      },
      buildSelect: function() {
        var select = $('<select/>', {
          id: 'usersCompany', name: 'company_id'
        });
        var option;
        $.each(companies.list(), function(key, value){
          option = $('<option/>', {
            value: value.id,
            text: value.name
          });
          select.append(option);
        });
        return select;
      },
      clear: function() {
        companies.storage = {};
      },
      find: function(id) {
        var company = $.grep(companies.list(), function(c) {
          return c.id == id;
        });
        if (company.length === 1) {
          return company[0];
        }
        return false;
      },
      findIndex: function(id) {
        var index = $.map(companies.list(), function(obj, index) {
          if (obj.id == id) {
            return index;
          }
        })
        if (index.length === 1) {
          return index[0];
        }
        return false;
      },
      list: function() {
        if (!companies.storage.list) {
          $.ajax({
            url: 'api/companies' + companies.ext,
            async: false
          }).done(function(data) {
            companies.storage.list = data;
          });
        }
        return companies.storage.list;
      },
      add: function(company) {
        var data = companies.storage;
        company.quota *= 1099511627776;
        $.ajax({
          url: 'api/companies' + companies.ext,
          type: 'POST',
          data: company,
          async: false
        }).done(function(response) {
          company.id = response.id;
          data.list.push(company);
        });
        return company;
      },
      edit: function(company) {
        company.quota *= 1099511627776;
        $.ajax({
          url: 'api/companies/' + company.id + companies.ext,
          type: 'PUT',
          data: {
            name: company.name,
            quota: company.quota
          },
          async: false
        }).done(function() {
          var index = companies.findIndex(company.id);
          companies.storage.list[index] = company;
        });
      },
      delete: function(id) {
        var removed = false;
        $.ajax({
          url: 'api/companies/' + id + companies.ext,
          type: 'DELETE',
          async: false
        }).done(function() {
          var index = companies.findIndex(id);
          companies.storage.list.splice(index, 1);
          removed = true;
        });
        return removed;
      },
      deleteHandler: function(e) {
        e.preventDefault();
        var id = companies.targetObject;
        if (companies.delete(id)) {
          companies.targetObject = null;
        }
        $('#modalCompanyDelete').modal('hide');
        companies.buildTableBody();
      },
      showCompanyHandler: function(e) {
        var data = $(e.relatedTarget).data();
        if (data.id) {
          var current = companies.find(data.id);
          $('#modalCompanyTitle').text('Edit company');
          $('#companyId').val(data.id);
          $('#name').val(current.name);
          $('#quota').val(Math.round(current.quota / 1099511627776));
          $('#formCompany .btn-primary').text('Save');
        } else {
          $('#modalCompanyTitle').text('Add company');
          $('#companyId').val('');
          $('#name').val('');
          $('#quota').val(10);
          $('#formCompany .btn-primary').text('Add');
        }
      },
      showDeleteCompanyHandler: function(e) {
        e.preventDefault();
        var data = $(e.relatedTarget).data();
        companies.targetObject = data.id;
      },
      saveCompanyHandler: function (form) {
        var resource = {};
        form = $(form);
        $.each(form.serializeArray(), function(_, kv) {
          resource[kv.name] = kv.value;
        });
        if (resource.id) {
          companies.edit(resource);
        } else {
          delete resource.id;
          companies.add(resource);
        }
        $('#modalCompany').modal('hide');
        companies.buildTableBody();
      }
    };
    return companies;
  };
})(jQuery,this);