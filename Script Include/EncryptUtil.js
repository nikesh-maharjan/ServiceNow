var grUser = new GlideRecord("sys_user");
if (grUser.get("user_name", "team.dev")) {
    var encr = new GlideEncrypter(); 
    var decrString = encr.decrypt(grUser.getValue("password")); 
}
gs.info("user_password: " + decrString);
