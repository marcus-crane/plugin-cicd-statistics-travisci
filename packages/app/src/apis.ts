import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  identityApiRef
} from '@backstage/core-plugin-api';
import { TravisCIStatisticsApi } from './apis/travis-ci-statistics'
import { cicdStatisticsApiRef } from '@backstage/plugin-cicd-statistics'

export const apis: AnyApiFactory[] = [
  // Add this alongside whatever else is in your API factory
  createApiFactory({
    api: cicdStatisticsApiRef,
    deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef }, // We provide these to the inner TravisCI client used by the Roadie Travis plugin
    factory: ({ discoveryApi, identityApi }) => new TravisCIStatisticsApi(discoveryApi, identityApi),
  })
];
