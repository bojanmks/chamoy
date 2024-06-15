export default (milliseconds: any) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}