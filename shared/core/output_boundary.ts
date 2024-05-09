// OutpoutBoundary aka IPresenter interface
export interface OutputBoundary<IResponse = void, IViewModel = void> {
  present(response: IResponse): Promise<IViewModel> | IViewModel | void;
}
