export default () => {
    return {
        wait: (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))
    }
}