export default [
    {
        "id": 1,
        "name": "collectableTypes",
        "storageType": "string",
        "type": "enum",
        "values": [
            "points_low",
            "points_med",
            "points_high",
            "health_low",
            "health_med",
            "health_high",
            "1UP"
        ],
        "valuesAsFlags": false
    },
    {
        "id": 5,
        "name": "enemyTypes",
        "storageType": "string",
        "type": "enum",
        "values": [
            "enemy1",
            "enemy2"
        ],
        "valuesAsFlags": false
    },
    {
        "color": "#ffa0a0a4",
        "drawFill": true,
        "id": 6,
        "members": [
            {
                "name": "className",
                "type": "string",
                "value": "obstacle"
            },
            {
                "name": "item",
                "propertyType": "collectableTypes",
                "type": "string",
                "value": "points_low"
            },
            {
                "name": "shouldSpawnItem",
                "type": "bool",
                "value": false
            },
            {
                "name": "type",
                "propertyType": "obstacleTypes",
                "type": "string",
                "value": "obstacle01"
            }
        ],
        "name": "Obstacle",
        "type": "class",
        "useAs": [
            "object",
            "project"
        ]
    },
    {
        "id": 7,
        "name": "obstacleTypes",
        "storageType": "string",
        "type": "enum",
        "values": [
            "obstacle01",
            "obstacle02"
        ],
        "valuesAsFlags": false
    },
    {
        "id": 3,
        "name": "playerSpawnIds",
        "storageType": "string",
        "type": "enum",
        "values": [
            "player_sp_0",
            "player_sp_1",
            "player_sp_2"
        ],
        "valuesAsFlags": false
    }
]

