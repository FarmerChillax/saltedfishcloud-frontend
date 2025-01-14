import { useJsonBody } from '@/utils/FormUtils/CommonFormUtils'
import { CommonRequest, MountPoint, DiskFileSystemDescribe, IdType } from '@/core/model'

const mountPoint = {
  prefix: 'mountPoint',
  listAvailableFileSystem(): CommonRequest<DiskFileSystemDescribe[]> {
    return {
      url: `${this.prefix}/listAvailableFileSystem`
    }
  },
  saveMountPoint(mountPoint: MountPoint) {
    return useJsonBody({
      url: `${this.prefix}/setMountPoint`,
      method: 'put',
      data: mountPoint
    })
  },
  getById(id: IdType): CommonRequest<MountPoint> {
    return {
      url: `${this.prefix}/getById`,
      params: {
        id
      }
    }
  }
}
export default mountPoint