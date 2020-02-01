import storage from 'electron-json-storage'

const s = {
	get<T extends Object>(key: string): Promise<T> {
		return new Promise((resolve, reject) => {
			storage.get(key, (err, data) => {
				if (err) reject(err)
				resolve(data as T)
			})
		})
	},
	set<T extends Object>(key: string, value: T): Promise<boolean> {
		return new Promise((resolve, reject) => {
			storage.set(key, value, err => {
				if (err) reject(err)
				resolve(true)
			})
		})
	}
}

export default s
