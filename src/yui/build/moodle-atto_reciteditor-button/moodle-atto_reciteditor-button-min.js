YUI.add("moodle-atto_reciteditor-button",function(t,e){t.namespace("M.atto_reciteditor").Button=t.Base.create("button",t.M.editor_atto.EditorPlugin,[],{initializer:function(){this.addButton({title:"htmleditor",icon:"html",iconComponent:"atto_reciteditor",callback:this.openHtmlEditor,buttonName:"htmleditor"})},globalVars:{popup:null},openHtmlEditor:function(t){var r;t.preventDefault(),null===this.globalVars.popup||this.globalVars.popup.closed?(r=this,t=M.cfg.wwwroot,t+="/lib/editor/atto/plugins/reciteditor/view.php",this.globalVars.popup=window.open(t,"HTML Bootstrap Editor","scrollbars=1"),(this.globalVars.popup.outerWidth<screen.availWidth||this.globalVars.popup.outerHeight<screen.availHeight)&&(this.globalVars.popup.moveTo(0,0),this.globalVars.popup.resizeTo(screen.availWidth,screen.availHeight)),this.globalVars.popup.attoInterface={},this.globalVars.popup.attoInterface.getSettings=function(){var t={};return t.contextid=M.cfg.contextid,t.wwwroot=M.cfg.wwwroot,t.theme=M.cfg.theme,t.themerev=M.cfg.themerev,t.sesskey=M.cfg.sesskey,t},this.globalVars.popup.attoInterface.getThemeCssRules=function(t){var e,o,i=window.document.styleSheets,r={rules:[],url:[]},s=M.recit.reciteditor.settings.stylesheet_to_add,s=s?s.split(","):[];for(e of i)if(e.href&&e.href.includes(`/theme/styles.php/${M.cfg.theme}`)||s.includes(e.title)){if(null==e.href||t)for(o of e.rules)r.rules.push(o);e.href&&r.url.push(e.href)}return r},this.globalVars.popup.attoInterface.getThemeUrl=function(){return`${M.cfg.wwwroot}/theme/styles.php/${M.cfg.theme}/${M.cfg.themerev}_${M.recit.reciteditor.settings.currentthemesubrev}/all`},this.globalVars.popup.attoInterface.getFileTransferData=function(){var t,e=r.get("host"),o=e.get("filepickeroptions").image||{},i={repo_id:0};for(t in i.client_id=o.client_id||0,i.env=o.env||"",i.license=o.defaultlicense||"",i.itemid=o.itemid||0,i.author=o.author||"",t="",o.repositories)if("upload"===o.repositories[t].type){i.repo_id=o.repositories[t].id;break}for(t in o.licenses)if("cc"===o.licenses[t].shortname){i.license=o.licenses[t].shortname;break}return i},this.globalVars.popup.attoInterface.getContent=function(){return r.editor.getHTML()},this.globalVars.popup.attoInterface.setContent=function(t){r.editor.setHTML(t),r.globalVars.popup.close()},this.globalVars.popup.M=M):this.globalVars.popup.focus()}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});