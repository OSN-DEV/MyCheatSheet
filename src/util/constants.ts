
/**
 * データファイル関連
 */
enum FilePath {
  AppDirectory = 'MyCheatSheet',
  /**
   * ファイル
   */
  CheatList =  `MyCheatSheet\\list.json`,
  /**
   * 設定情報
   */
  Settings = `MyCheatSheet\\setting.json`,
}

/**
 * エラーコード
 */
enum ErrorCode {
  /**
   * エラーなし
   */
  None = 0,
  /**
   * キャンセル
   */
  Canceled = 1,
  /**
   * すでに存在する
   */
  Exist = 2,
  /**
   * 不正
   */
  Invalid = 3,
  /**
   * 予期せぬエラー
   */
  Unknown  = 999
}

/**
 * イベント定義
 */
enum EventDef {
  /**
   * チートファイルのインポート
   */
  ImportCheatFile = 'my-app:import-cheat-file',

  /**
   * チートファイルの一覧取得
   */
  GetCheatFiles = 'my-app:get-cheat-files',

  /**
   * チートファイル取得
   */
  GetCheatFile = 'my-app:get-cheat-file',

  /**
   * チートファイルの一覧保存
   */
  SaveCheatFiles = 'my-app:save-cheat-files',
  /**
   * チートファイルの一覧送信
   */
  SendCheatList = 'my-app:send-cheat-list',
  /**
   * チートデータの送信
   */
  SendCheatData = 'my-app:send-cheat-data',

  /**
   * チートファイルを表示
   */
  SelectCheatFile = 'my-app:select-cheat-file',

  /**
   * チートリストの表示
   */
  ShowCheatList = 'my-app:show-cheat-list',

  /**
   * チートリストのクローズ
   */
  CloseCheatList = 'my-app:close-cheat-list',

}

export {
  FilePath, EventDef, ErrorCode
}

