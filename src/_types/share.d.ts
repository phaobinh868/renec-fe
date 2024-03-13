export interface Share {
    _id?: string
    video_id?: string
    title?: string
    channel?: string
    thumbnail?: string
    description?: string
    created_at?: string
    user: User
}