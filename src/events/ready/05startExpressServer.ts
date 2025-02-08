import useExpress from "@express/useExpress";

const { startExpressServer } = useExpress();

export default async () => {
    await startExpressServer();
};