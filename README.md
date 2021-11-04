# Slack message resending app
A small bot, that allows to send one message to many users at the same time.

### Usage
1. Open resending menu:
    - Via message shortcut 
    Point mouse on any message > ```More actions``` (three dots) > ```Resend message```. If no such option, select "More message shortcuts.." and select it from the list.
    - Via slash command
    In any chat just type `/resend <message>` (`<message>` may be empty here).
2. Write/correct message if needed.
3. Select adressees - specific users or channels. 
**Warning**, selecting chat means you wand to send direct message **to its every member**, but channel **will not** get this message. 
4. If you want to select all workspace (team) members and guests - select `Send to all users in workspace`.
Note, that previously selected addressees will be ignored.
5. If you want to schedule message for specific time in future - select `Send later` and choose date and time at the bottom of menu.
6. You may send message as bot (anonimously) or as you, according to `Choose sender` setting.
7. You may limit addressees to team members or guests according to your `Limit sending to` setting
8. Click `Submit` and you will get confirmation message from the bot if sending were successful or who did not get your message (if there were any troubles).

That`s all)

### Installation
To deploy this bot to your heroku you should:
1. Create Slack app here: https://api.slack.com/apps
2. Click **Create new app** > **From manifest** and load app_config.json as manifest.
3. Create app in Heroku: https://dashboard.heroku.com/apps
4. Add addon **Heroku Postgres**: https://elements.heroku.com/addons/heroku-postgresql
5. Set Heroku app environment variables in **Your app** > **Settings** > **Reveal config vars**.
    - NODE_ENV = production
    - SLACK_CLIENT_ID, SLACK_CLIENT_SECRET and SLACK_SIGNING_SECRET can be get from your Slack app settings "Basic information" page.
6. Deploy app to Heroku from this repo.
7. Modify Slack app manifest URLs with your app's URL
(for example, change 
`https://your-app.herokuapp.com/slack/interactive-endpoint/slash` to 
`https://ethical-resended.herokuapp.com/slack/interactive-endpoint/slash`)
8. Save changes to manifest and verify URL.
9. Head to Slack app **Manage Distribution** page, click **Install app** and allow Public distribution if needed.

That's all)