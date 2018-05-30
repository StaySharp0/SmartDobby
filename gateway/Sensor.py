from socket import *
import time
import json
import pymysql
import threading
import os

class Sensor(threading.Thread):
	def __init__(self,Socket):
		threading.Thread.__init__(self) 
		self.lock = threading.Lock()
		self.baseHost='localhost'
		self.basePort = 9000
		
		self.baseList = {} # key: baseId / value : { }
		self.serverList = {} # key: sid / value : baseList item
		self.bs_soc = socket(AF_INET, SOCK_STREAM)
		# self.msg = [0x00, 0xff, 0xff, 0x00, 0x00, 0x02, 0x00, 0x89, 0x00]
		self.Socket = Socket
		try:
			# setting db
			self.con = pymysql.connect(host=self.baseHost, port=3306, user='root', passwd='1q2w3e', db='SENSOR_LIST', charset='utf8')
			self.cur = self.con.cursor()
			self.cur.execute("select * from sensor where sid!=0")
			for r in self.cur.fetchall():
				self.baseList[r[0]] = {
					'mid': r[0].split(":")[0],
					'bid': r[0],
					'type': r[0].split(":")[1],
					'value': 0,
					'name': r[3],
					'sid': r[4],
				}

				if r[4] != 0:
					self.serverList[r[4]] = self.baseList[r[0]]

			# setting baseTCP
			self.bs_soc.connect((self.baseHost, self.basePort))
			data = self.bs_soc.recv(2)
			msg = "U "
			if data != 'U ':
				print("Wrong handshake")
			self.bs_soc.send(msg.encode())
			print("Connected")
			self._getSensorList()
		except Exception as e:
			print(e)
			return
		print('Sensor Thread Init complete')

	def _getBaseID(self, moteID, stype):
		return str(moteID) + ":" + str(stype)

	def run(self):
		print('Sensor Thread Start!')
		buffer = ''
		while True:
			length = ord(self.bs_soc.recv(1))
			data = self.bs_soc.recv(length)
			data = data[8:].decode().replace('\0', '')
			buffer += data
			print(buffer)
			pos = buffer.find('|')
			if pos != -1:
				spos = buffer.find('{')
				msg = buffer[spos:pos].replace('\0', '')
				msg = json.loads(msg)
				buffer = buffer[pos+1:]
			else:
				continue
			
			print(msg)
			if msg["status"] == "list":
				self._add(msg["id"], msg["type"])
			elif msg["status"] == "value":
				self._update(msg["id"], msg["type"], msg['value'])
	
	def _getSensorList(self):
		# self.msg[8] = 0x01
		# self.bs_soc.send(''.join([chr(d) for d in self.msg]).encode())
		os.system('~/mysend localhost 9000 01')
	
	def _add(self, moteID, sType):
		with self.lock:
			baseID = self._getBaseID(moteID, sType)

			if baseID in self.baseList.keys():
				if self.baseList[baseID]['sid'] == 0:
					self.Socket._emit_createSensor(self.baseList[baseID])
			else:
				self.baseList[baseID] = {
					'mid': moteID,
					'bid': baseID,
					'type': sType,
					'value': 0,
					'name': baseID,
					'sid': 0,
				}
				ipt = tuple(self.baseList[baseID].values())

				insert_command = "insert into sensor (id, type, gid, name, sid) values (%s, %s, %s, %s, %s) on duplicate key update id=values(id)"
				self.cur.execute(insert_command, (baseID, sType, "0", baseID, "0"))
				self.con.commit()
				self.Socket._emit_createSensor(self.baseList[baseID])
	
	def _update(self, moteId, sType, value):
		with self.lock:
			baseID = self._getBaseID(moteId, sType)

			select_command = "select sid from sensor where id='%s'" % baseID 
			self.cur.execute(select_command)
			row = self.cur.fetchall()

			if len(row) > 0 and len(row[0]) > 0 and row[0][0] != 0:
				self.Socket._emit_updateValueSensor(row[0][0], value, time.strftime("%Y-%m-%d %H:%M:%S"))

	def updateServerSensorID(self, baseID, sid):
		with self.lock:
			self.baseList[baseID]['sid'] = sid
			
			update_ssid_command = "update sensor set sid=%s where id=%s"
			self.cur.execute(update_ssid_command, (sid, baseID))
			self.con.commit()
			
			self.baseList[sid] = self.baseList[baseID]

	def refreshSensor(self, sid):
		with self.lock:
			moteID = self.serverList[sid]['bid'].split(':')[0]
			os.system('~/mysend localhost 9000 02 %s' % (moteID))

	def updateSensorName(self, sid, name):
		with self.lock:
			update_sid_command = "update sensor set name=%s where sid=%s"
			self.cur.execute(update_sid_command, (name, sid))
			self.con.commit()

			self.serverList[sid]['name'] = name

	def updateSensorInterval(self, sid, interval):
		with self.lock:
			print('updateSensorInterval')
			moteID = self.serverList[sid]['bid'].split(':')[0]
			os.system('~/mysend localhost 9000 04 %s %s' % (moteID, interval))

		
