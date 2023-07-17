api.emit("NOW_UXF_PAGE#ADD_NOTIFICATIONS", {
    items: [
        {
            id: "alert1",
            status: "low",
            icon: "circle-check-outline",
            content: {
                type: "html",
                value: "<h4>" + response.result.status + "<h4>"
            },
            action: {
                type: "open",
                href: "#",
                label: "Google"
            },
            header: "Low"
        },
        {
            id: "alert2",
            status: "positive",
            icon: "circle-check-outline",
            content: {
                type: "html",
                value: "<h4>" + response.result.status + "<h4>"
            },
            action: {
                type: "dismiss"
            },
            header: "Positive"
        },
        {
            id: "alert3",
            status: "info",
            icon: "circle-check-outline",
            content: {
                type: "html",
                value: "<h4>" + response.result.status + "<h4>"
            },
            action: {
                type: "dismiss"
            },
            header: "Info"
        },
        {
            id: "alert4",
            status: "warning",
            icon: "circle-check-outline",
            content: {
                type: "html",
                value: "<h4>" + response.result.status + "<h4>"
            },
            action: {
                type: "acknowledge"
            },
            header: "Warning"
        },
        {
            id: "alert5",
            status: "moderate",
            icon: "circle-check-outline",
            content: {
                type: "html",
                value: "<h4>" + response.result.status + "<h4>"
            },
            action: {
                type: "dismiss"
            },
            header: "Moderate"
        },
        {
            id: "alert6",
            status: "high",
            icon: "circle-check-outline",
            content: {
                type: "html",
                value: "<h4>" + response.result.status + "<h4>"
            },
            action: {
                type: "dismiss"
            },
            header: "High"
        },
        {
            id: "alert7",
            status: "critical",
            icon: "circle-check-outline",
            content: {
                type: "html",
                value: "<h4>" + response.result.status + "<h4>"
            },
            action: {
                type: "dismiss"
            },
            header: "Critical"
        },
    ]
});