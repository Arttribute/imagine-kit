export const ComponentsFormat = `{
        "name": "app name",
        "description": "app description",
        "nodes": [
            {
                "node_id": "node_id",
                "type": "type",
                "name": "name",
                "data": {
                    "inputs": [
                        {
                            "id": "id",
                            "label": "label",
                            "value": "value"
                        }
                    ],
                    "outputs": [
                        {
                            "id": "id",
                            "label": "label",
                            "value": "value"
                        }
                    ],
                    "instruction": "instruction",
                    "memoryFields": [
                        {
                            "id": "id",
                            "label": "label",
                            "value": "value"
                        }
                    ]
                },
                "position": {
                    "x": x,
                    "y": y
                }
            }
        ],
        "edges": [
            {
                "source": "source",
                "target": "target",
                "sourceHandle": "sourceHandle",
                "targetHandle": "targetHandle"
            }
        ],
        "uiComponents": [
            {
                "component_id": "component_id",
                "type": "type",
                "label": "label",
                "position": {
                    "x": x,
                    "y": y,
                    "width": width,
                    "height": height
                }
            }
        ]
    }`;
