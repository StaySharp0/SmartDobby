from Sensor import Sensor 
from IRSerial import IRSerial
from socketIO_client_nexus import SocketIO, BaseNamespace
import os, sys, json 

class MainClient:
	def __init__(self, token):
		self.APIServer = '13.209.66.217'
		self.port = 3000
		self.Sensor = Sensor(self)
		self.token = token
		self.gid = -1
		self.gname = 'default gateway name'
		self.SocketIO = SocketIO(
			self.APIServer, self.port,
			headers = {'x-access-token': self.token},
		)
		self.Socket = self.SocketIO.define(BaseNamespace, '/gateway')
		
		self.IRSerial = IRSerial(self)
		self.IRSerialTemp = []

		self._setOnListener()

		# Check Setting backfile
		if os.path.isfile('setting.json'): 
			settings = json.loads(open('setting.json').read())
			self.gid = settings['gid']
			self.gname = settings['gname']
			self._emit_notifyGid()
		else:
			self.macAddr = self._getMAC('wlan0')
			self._emit_gatewayInit()

	def Run(self):
		print('MainClient Start!')
		self.Sensor.start()
		while True:
			self.SocketIO.wait()

	def _setOnListener(self):
		self.Socket.on('reconnect', self._on_reconnect)
		self.Socket.on('res/gateway/create', self._on_setGid)
		self.Socket.on('res/sensor/create', self._on_setSID)
		self.Socket.on('req/sensor/refresh', self._on_refreshSensor)
		self.Socket.on('req/sensor/update/name', self._on_setSensorName)
		self.Socket.on('req/sensor/update/interval', self._on_setSensorInterval)
		self.Socket.on('req/remocon/learn', self._on_getIRSerial)
		self.Socket.on('req/remocon/learn/OK', self._on_updateIRSerial)

	def _on_reconnect(self):
		print('reconnect')
		self._emit_notifyGid()

	def _on_setGid(self, obj):
		if obj['status'] is True:
			self.gid = obj['data']['gatewayID']

			f = open('setting.json', 'w', encoding='utf-8')
			f.write(json.dumps({
				'gid': self.gid,
				'gname': self.gname
			}, ensure_ascii=False, indent="\t"))
			f.close()
			self._emit_notifyGid()
	def _on_setSID(self, obj):
		if obj['status'] is True:
			baseID = obj['data']['_id']
			sid = obj['data']['sensorID']

			self.Sensor.updateServerSensorID(baseID, sid)
	def _on_refreshSensor(self, obj):
		self.Sensor.refreshSensor(obj['sid'])
	def _on_setSensorName(self, obj):
		self.Sensor.updateSensorName(obj['sid'],  obj['name'])
	def _on_setSensorInterval(self, obj):
		self.Sensor.updateSensorInterval(obj['sid'], obj['interval'])
	def _on_getIRSerial(self, obj):
		print('On getIRSerial!')
		# self.IRSerial.mode = 'in'
		# self.IRSerial.start()

	def _on_updateIRSerial(self, obj):
		self.IRSerial.start()

	def _emit_gatewayInit(self):
		self.Socket.emit('req/gateway/create',{
			'token': self.token,
			'name': self.gname,
			'mac_addr': self.macAddr
		})
		self.SocketIO.wait(seconds=1)
	def _emit_notifyGid(self):
		self.Socket.emit('req/connection/init',{
			'gid': self.gid
		})
		self.SocketIO.wait(seconds=1)
	def _emit_createSensor(self, s):
		self.Socket.emit('req/sensor/create', {
			'_id' : s['bid'],
			'gid' : self.gid,
			'type' : s['type'],
			'name' : s['name'],
		})
	def _emit_updateValueSensor(self, sid, value, time):
		self.Socket.emit('req/sensor/update', {
			'sid' : sid,
			'gid' : self.gid,
			'token': self.token,
			'time' : time,
			'value' : value,
		})
	def _emit_res_getIRSerial(self):
		self.Socket.emit('res/remocon/learn')

	def _getMAC(self, interface):
		try:
			str = open('/sys/class/net/%s/address' %interface).read()
		except:
			str = "00:00:00:00:00:00"

		return str[0:17]


if __name__ == "__main__":
	main = MainClient("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjQwLCJlbWFpbCI6InRlc3RAdGVzdC5jb20xIiwibmFtZSI6Iu2FjOyKpO2EsCIsImlhdCI6MTUyNzE1MjA5NywiZXhwIjoxNTI4MzYxNjk3LCJpc3MiOiJ0ZWFtYmFjay5jb20iLCJzdWIiOiJ1c2VySW5mbyJ9.NIztP5kP2ibojOXcGeYvTTwKxOTOQiXnLgbsyrUzGho")
	# main = MainClient(sys.argv[1])

	main.Run()