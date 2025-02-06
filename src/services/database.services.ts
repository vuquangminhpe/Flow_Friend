import { MongoClient, Db, Collection } from 'mongodb'
import Follower from '../models/schemas/Follower.schema'
import { envConfig } from '../constants/config'
import User from '../models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
const uri = `mongodb+srv://${envConfig.db_username}:${envConfig.db_password}@minhdevmongo.hzvnp.mongodb.net/?retryWrites=true&w=majority&appName=minhdevMongo`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.db_name)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)

      return error
    }
  }

  async indexFollowers() {
    const exits = await this.users.indexExists('user_id_1_followed_user_id_1')
    if (!exits) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 }, { unique: true })
    }
  }
  async indexUsers() {
    const exits = await this.users.indexExists(['email_1_password_1', 'email_1'])
    if (!exits) {
      this.users.createIndex({ email: 1, password: 1 }, { unique: true })
      this.users.createIndex({ email: 1 }, { unique: true })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.usersCollection)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.followersCollection)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(envConfig.refreshCollection)
  }
}
const databaseService = new DatabaseService()
export default databaseService
