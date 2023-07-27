[
    // data source for Filter Source
    {
        "type": "table",
        "table": {
            "id": "scope_table",
            "label": "Table Name"
        },
        "encodedQuery": "active=true"
    },

    // Filter Source for Data to Filter, still not sure what this does
    [
        {
          "type": "table",
          "table": {
            "id": "scope_table",
            "label": "Table Name"
          },
          "field": {
            "id": "field_name",
            "type": "reference",
            "label": "Field Label",
            "reference": "scope_table_ref",
            "referenceLabel": "Table Label Ref"
          }
        }
      ]
]