// InputBoundary aka IUseCase interface
export interface InputBoundary<IRequest = void, IResponse = void> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}
