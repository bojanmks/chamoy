export interface Command {
    name: string;
    description: string;
    options: any[];
    callback(client: any, interaction: any): void;
}