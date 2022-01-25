
//https://api.slack.com/apps/

/**
 * 1度だけ実行
 * slackのBOTTokenと投稿するチャンネルをスクリプトプロパティに保存する
 */
function propSet() {
  PropertiesService.getScriptProperties().setProperty("BOT_USER_OAUTH_TOKEN", "");
  PropertiesService.getScriptProperties().setProperty("POST_CHNNNEL_ID", "");
}

/**
 * 平日にトリガー実行｡特定のチャンネルにボタン付きのメッセージを投稿する｡
 */
function postMainMessage() {
  const day = new Date().getDay(); 
  if (day === 0 || day === 6) return;

  const channel = PROPERTIES.get("POST_CHNNNEL_ID");
  const slack = new SlackApi();
  const formatDt = Utilities.formatDate(new Date(), 'JST', 'MM月dd日');
  const text = {
    text:
    `おはようございます!:sunny:\n今日は${formatDt}です｡\n今日も一日頑張りましょう!:smiling_face_with_3_hearts:`
  };
  const blocksJson = makeBlockKit("Attendance",text);
  const response = slack.postBlokMessage(channel,blocksJson);
  Properties.set("SLACK_POST_TS",response.ts);
  return
}
/**
 * 特定の時間にトリガー実行｡投稿したメッセージを書き換える｡
 */
function postMessageUpdate() {
  const channel = PROPERTIES.get("POST_CHNNNEL_ID");
  const slack = new SlackApi();
  const ts = PROPERTIES.get("SLACK_POST_TS");
  const text = {
    text:
    `今日も一日お疲れさまでした!`
  };
  const blocksJson = makeBlockKit("Attendance",text);
  slack.updateBlokMessage(channel,blocksJson,ts);
}


/**
 * POSTリクエストに対する処理
 *
 * @param {object} e - 受け取ったリクエストパラメータ
 */
function doPost(e) {

  const slack = new SlackApi()
  
  const channel = slack.getFromElementsChannelId(e)
  const messageTs = slack.getFromElementsMessageTs(e)
  const userId = slack.getFromElementsUserId(e)
  const userName = slack.getFromElementsUserName(e)
  const actionsValue = slack.getFromElementsActionsValue(e)

  const msg = `<@${userId}> さんの出勤${actionsValue}を記録しました!`
  slack.postThreadMessage(channel, msg, messageTs)

  const sheet = new Sheet()
  const values = [[new Date,userId,userName,actionsValue]]
  sheet.appendRows(values)

}


/**
 * ブロックキットのJSONを返します。
 * ドキュメント:https://api.slack.com/reference/interaction-payloads/block-actions
 *
 * @param {strign} templateName - テンプレートの名前
 * @param {Object} replaceTextLists - 置き換える文字列の配列
 * @return {Object}
 */
function makeBlockKit(templateName = "Attendance", replaceTextLists) {

  if (templateName === "Attendance") {
    const simpleBlockKit = [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": replaceTextLists.text
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "出勤"
            },
            "style": "primary",
            "value": "出勤"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "退勤"
            },
            "style": "danger",
            "value": "退勤"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "休憩行き"
            },
            "value": "休憩行き"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "休憩戻り"
            },
            "value": "休憩戻り"
          }
        ]
      }
    ]
    return simpleBlockKit
  }
  return
}



