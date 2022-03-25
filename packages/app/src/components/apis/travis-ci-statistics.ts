import { TravisCIApiClient, FetchParams } from '@roadiehq/backstage-plugin-travis-ci'
import {
  CicdConfiguration,
  CicdState,
  CicdStatisticsApi,
  FetchBuildsOptions,
  GetConfigurationOptions,
  Build,
  Stage
} from '@backstage/plugin-cicd-statistics'
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api'

// This is a quick hack. You should use getConfiguration to overwrite the available statuses!
function convertStatusEnum(status: string) {
  switch (status) {
    case 'created':
      return 'enqueued'
    case 'started':
      return 'running'
    case 'passed':
      return 'succeeded'
    case 'failed':
      return 'failed'
    case 'canceled':
      return 'aborted'
    default:
      return 'unknown'
  }
}

export class TravisCIStatisticsApi implements CicdStatisticsApi {
  discoveryApi: DiscoveryApi
  identityApi: IdentityApi

  constructor(discoveryApi, identityApi) {
    this.discoveryApi = discoveryApi
    this.identityApi = identityApi;
  }

  async getConfiguration(options: GetConfigurationOptions): Promise<Partial<CicdConfiguration>> {
    let config: CicdConfiguration = {}
    return config
  }

  async fetchBuilds(options: FetchBuildsOptions): Promise<CicdState> {
    // We just make use of the existing TravisCI API Client that comes with the Travis CI/CD provider
    // rather than reinventing the wheel
    const travisCiClient = new TravisCIApiClient({ discoveryApi: this.discoveryApi, identityApi: this.identityApi })
    console.log(options.entity)
    const fetchParams: FetchParams = {
      limit: 100, // 100 is the upper limit so you might want to paginate for more builds
      repoSlug: options.entity.metadata.annotations['github.com/project-slug'] // This could be null!
    }
    const buildResults = await travisCiClient.getBuilds(fetchParams)
    let builds: Array<Build> = []
    for (let entry of buildResults) {
      let stages: Array<Stage> = []
      for (let item of entry.stages) {
        const duration = new Date(item.finished_at) - new Date(item.started_at)
        let stage: Stage = {
          name: item.name,
          status: convertStatusEnum(item.state),
          duration
        }
        stages.push(stage)
      }
      let build: Build = {
        id: entry.id,
        status: convertStatusEnum(entry.state),
        branchType: entry.branch.name === "master" || entry.branch.name === "main" ? "master" : "branch", // Ugly hack, use getConfiguration. I dunno how yet is all
        requestedAt: new Date(entry.started_at),
        duration: entry.duration,
        stages
      }
      builds.push(build)
    }
    let cicdState: CicdState = { builds }
    return cicdState
  }
}
