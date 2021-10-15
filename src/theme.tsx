export enum ThemeType {
    light, dark
}

export type Theme = {
    fontColor: {
        primary: string,
        secondary: string,
        accent: string,
        warning: string,
        info: string
    },
    background: {
        primary: string,
        secondary: string,
        secondary700: string,
        accent: string,
        warning: string
    },
    border: {
        primary: string
    }
};

export default {
    light: {
        fontColor: {
            primary: "#000000",
            secondary: "#636363",
            accent: "#FFFFFF",
            warning: "#E3444C",
            info: "#0159F2"
        },
        background: {
            primary: "#FFFFFF",
            secondary: "#F6F6F6",
            secondary700: "#999999",
            accent: "#0159F2",
            warning: "#FDE4E3"
        },
        border: {
            primary: "#e6e6e6"
        }
    },
    dark: {
        fontColor: {
            primary: "#FFFFFF",
            secondary: "#848484",
            accent: "#FFFFFF",
            warning: "#FC444D",
            info: "#0B85FF"
        },
        background: {
            primary: "#000000",
            secondary: "#0f0f0f",
            secondary700: "#999999",
            accent: "#0B85FF",
            warning: "#41120E"
        },
        border: {
            primary: "#0f0f0f"
        }
    }
}