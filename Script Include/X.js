var X = Class.create();

X.getConfig = function (name, field) {
	// find environment specific config value if present
	var gr = new GlideRecord("scope_m2m_config_environment"); // m2m config and env
	gr.addQuery("configuration.name", name);
	gr.addQuery("environment.instance_name", gs.getProperty("instance_name"));
	gr.setLimit(1);
	gr.query();
	if (gr.next()) {
		if (gs.nil(field)) {
			return gr.getValue("value");
		} else {
			if (gr.isValidField(field)) {
				return gr.getValue(field);
			}
		}
	}
	
	// return default value if the environment specific value is not found
	var gr2 = new GlideRecord("scope_configuration");
	gr2.addQuery("name", name);
	gr2.query();
	if (gr2.next()) {
		if (gs.nil(field)) {
			return gr2.getValue("default_value");
		} else {
			if (gr2.isValidField(field)) {
				return gr2.getValue(field);
			}
		}
	}
};