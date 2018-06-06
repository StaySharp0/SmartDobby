import serial
import threading
import time

class IRSerial(threading.Thread):
    

    def __init__(self, Socket):
        threading.Thread.__init__(self)
        self.Socket = Socket
        self.mode = ''
        self.ir_raw = []
    def run(self):
        if self.mode == 'in':
            self.getIRSerial()
        elif self.mode == 'out':
            self.verifyIRSerial()

        self.mode = ''
    def syncIRSerial(self, s):
        data = 'i'
        s.write(data.encode())
        time.sleep(.1)
        buf = s.read(s.in_waiting)
        if(buf == b''):
            time.sleep(1)
            s.write(data.encode())
            time.sleep(.1)
            buf = s.read(s.in_waiting)

    def verifyIRSerial(self):
        with serial.Serial(port='/dev/ttyACM0', baudrate=9600) as s:
            syncIRSerial(s)
            data = 'w'
            s.write(data.encode())
            time.sleep(.1)
            
            i = len(self.ir_raw)
            ir_len = "%s%s"%(str(i), "\r\n")
            s.write(ir_len.encode())
            time.sleep(.1)
            
            for cnt in range(i):
                if cnt != i-1:
                    ir_raw_item = "%s%s"%(str(self.ir_raw[cnt]), ",")
                else:
                    ir_raw_item = str(self.ir_raw[cnt])
                s.write(ir_raw_item.encode())

            self.ir_raw = []
                
                

    def getIRSerial(self):
        with serial.Serial(port='/dev/ttyACM0', baudrate=9600) as s:
            syncIRSerial(s)    
            data = 'r'
            s.write(data.encode())
            time.sleep(.1)
            if(s.readable()):
                size = s.readline()
                i = size.decode()
                if i == '\n':
                    time.sleep(.1)
                    size = s.readline()
                    i = size.decode()
                i = int(i)
                raw_buf = []
                j = 0

                while True:
                    if j == i:
                        break
                    res = s.readline()
                    raw_buf += [res.decode()[:len(res)-2]]
                    j += 1

                self.Socket.IRSerialTemp = raw_buf
                self.Socket._emit_res_getIRSerial()

#        raw_buf = [] 
#        ser = serial.Serial(
#                port='/dev/ttyACM0',
#                baudrate=9600,
#        )
#    
#        if ser.readable():
#            size = ser.readline()
#            i = size.decode()
#            if i == '\n':
#                print("Inaccurate signal.")
#                return -1
#            i = int(i)
#            j = 0
#            while True:
#                if j == i:
#                    raw_buf.append("finish")
#                    break
#                res = ser.readline()
#                raw_buf += [res.decode()[:len(res)-1]]
#                j += 1
#    
#                self.Socket.IRSerialTemp = raw_buf
#
#                self.Socket._emit_res_getIRSerial()
