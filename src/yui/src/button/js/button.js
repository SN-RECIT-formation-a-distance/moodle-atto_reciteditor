// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto HTML editor
 *
 * @package    atto_reciteditor
 * @copyright  2019 RECIT
 * @license    {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */
/**
     * @module moodle-atto_reciteditor-button
     */
    
    /**
     * Atto text editor vvvebjs plugin.
     *
     * @namespace M.atto_reciteditor
     * @class button
     * @extends M.editor_atto.EditorPlugin
     */

Y.namespace('M.atto_reciteditor').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
     * Add the buttons to the toolbar
     *
     * @method initializer
     */
    initializer: function() {
        this.addButton({
            title: 'htmleditor',
            icon: 'html',
            iconComponent: 'atto_reciteditor',
            callback: this.openHtmlEditor,
            buttonName: 'htmleditor'
        });
    },

    openHtmlEditor: function(e) {
        e.preventDefault();
        var that = this;
       
        var url = M.cfg.wwwroot;
        url += "/lib/editor/atto/plugins/reciteditor/build/index.php";
        
        var popup = window.open(url,'Éditeur RÉCIT','scrollbars=1');

        if (popup.outerWidth < screen.availWidth || popup.outerHeight < screen.availHeight)
        {
          popup.moveTo(0,0);
          popup.resizeTo(screen.availWidth, screen.availHeight);
        }

        popup.attoInterface = {};

        popup.attoInterface.getSettings = function(){
            var result = {};
            result.contextid = M.cfg.contextid;
            result.wwwroot = M.cfg.wwwroot;
            result.theme = M.cfg.theme;
            result.themerev = M.cfg.themerev;
            result.sesskey = M.cfg.sesskey;
            return result;
        }

        var cssRulesBuffer = [];
        popup.attoInterface.getThemeCssRules = function(){
            var styleSheets = window.document.styleSheets;

            if(cssRulesBuffer.length > 0){ return cssRulesBuffer;}

            cssRulesBuffer = [];
            var themeUrl = popup.attoInterface.getThemeUrl();
            for(var sheet of styleSheets){
                // the only css rules we are looking for is the current theme or some custom css from theme-recit
                if((sheet.href !== themeUrl) && (sheet.title !== 'theme-recit-custom-css')){
                    continue;
                }

                for(var rule of sheet.rules){
                    cssRulesBuffer.push(rule);
                }
            }

            return cssRulesBuffer;
        }

        popup.attoInterface.getThemeUrl = function(){
            return `${M.cfg.wwwroot}/theme/styles.php/${M.cfg.theme}/${M.cfg.themerev}_${M.recit.reciteditor.settings.currentthemesubrev}/all`;
        }

        popup.attoInterface.getFileTransferData = function(){
            var host = that.get('host');
            var options = host.get('filepickeroptions').image || {};
            
            var result = {};
            result.repo_id = 0 || 0;
            result.client_id = options.client_id || 0;
            result.env = options.env || '';
            result.license = options.defaultlicense || '';
            result.itemid = options.itemid || 0;
            result.author = options.author || '';

            var attr = '';
            for(attr in options.repositories){
                if (options.repositories[attr].type === 'upload') {
                    result.repo_id = options.repositories[attr].id;
                    break;
                }
            }

            for(attr in options.licenses){
                if (options.licenses[attr].shortname === 'cc') { // creative commons
                    result.license = options.licenses[attr].shortname;
                    break;
                }
            }

            return result;
        };

        popup.attoInterface.getContent = function(){
            return that.editor.getHTML();
        };

        popup.attoInterface.setContent = function(htmlStr){
            that.editor.setHTML(htmlStr);
            popup.close();
        };

        popup.M = M;
    },
});
