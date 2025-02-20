export interface IModule {
    priority: number | undefined;
    Run(): void;
}
