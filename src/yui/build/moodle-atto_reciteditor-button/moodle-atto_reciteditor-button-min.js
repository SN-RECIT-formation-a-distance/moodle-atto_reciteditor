YUI.add("moodle-atto_reciteditor-button",function(e,t){e.namespace("M.atto_reciteditor").Button=e.Base.create("button",e.M.editor_atto.EditorPlugin,[],{initializer:function(){this.addButton({title:"htmleditor",icon:"html",iconComponent:"atto_reciteditor",callback:this.openHtmlEditor,buttonName:"htmleditor"})},openHtmlEditor:function(e){var r,t;e.preventDefault(),r=this,e=M.cfg.wwwroot,e+="/lib/editor/atto/plugins/reciteditor/build/index.php",((t=window.open(e,"Éditeur RÉCIT","scrollbars=1")).outerWidth<screen.availWidth||t.outerHeight<screen.availHeight)&&(t.moveTo(0,0),t.resizeTo(screen.availWidth,screen.availHeight)),t.attoInterface={},t.attoInterface.getSettings=function(){var e={};return e.contextid=M.cfg.contextid,e.wwwroot=M.cfg.wwwroot,e.theme=M.cfg.theme,e.themerev=M.cfg.themerev,e.sesskey=M.cfg.sesskey,e},t.attoInterface.getFileTransferData=function(){var e,t=r.get("host"),i=t.get("filepickeroptions").image||{},o={repo_id:0};for(e in o.client_id=i.client_id||0,o.env=i.env||"",o.license=i.defaultlicense||"",o.itemid=i.itemid||0,o.author=i.author||"",e="",i.repositories)if("upload"===i.repositories[e].type){o.repo_id=i.repositories[e].id;break}for(e in i.licenses)if("cc"===i.licenses[e].shortname){o.license=i.licenses[e].shortname;break}return o},t.attoInterface.getContent=function(){return r.editor.getHTML()},t.attoInterface.setContent=function(e){r.editor.setHTML(e),t.close()}}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});