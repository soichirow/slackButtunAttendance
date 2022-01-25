function myFunction() {
  const App_Manifest_Json={
    "display_information": {
        "name": "***botの名前***",
        "description": "***botの説明***",
        "background_color": "#4e855a"
    },
    "features": {
        "bot_user": {
            "display_name": "***botの名前***",
            "always_online": false
        }
    },
    "oauth_config": {
        "scopes": {
            "bot": [
                "chat:write",
                "chat:write.public",
                "chat:write.customize"
            ]
        }
    },
    "settings": {
        "interactivity": {
            "is_enabled": true,
            "request_url": "****GASをデプロイしたときに発行されるURLを記載****"
        },
        "org_deploy_enabled": false,
        "socket_mode_enabled": false,
        "token_rotation_enabled": false
    }
} 
}
