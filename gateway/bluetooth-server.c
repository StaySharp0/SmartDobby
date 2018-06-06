#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <bluetooth/bluetooth.h>
#include <bluetooth/sdp.h>
#include <bluetooth/sdp_lib.h>
#include <bluetooth/rfcomm.h>
#include <string.h>
#include <ctype.h>


bdaddr_t bdaddr_any = {0, 0, 0, 0, 0, 0};
bdaddr_t bdaddr_local = {0, 0, 0, 0xff, 0xff, 0xff};

int _str2uuid( const char *uuid_str, uuid_t *uuid ) {
    /* This is from the pybluez stack */

    uint32_t uuid_int[4];
    char *endptr;

    if( strlen( uuid_str ) == 36 ) {
        char buf[9] = { 0 };

        if( uuid_str[8] != '-' && uuid_str[13] != '-' &&
        uuid_str[18] != '-' && uuid_str[23] != '-' ) {
        return 0;
    }
    // first 8-bytes
    strncpy(buf, uuid_str, 8);
    uuid_int[0] = htonl( strtoul( buf, &endptr, 16 ) );
    if( endptr != buf + 8 ) return 0;
        // second 8-bytes
        strncpy(buf, uuid_str+9, 4);
        strncpy(buf+4, uuid_str+14, 4);
        uuid_int[1] = htonl( strtoul( buf, &endptr, 16 ) );
        if( endptr != buf + 8 ) return 0;

        // third 8-bytes
        strncpy(buf, uuid_str+19, 4);
        strncpy(buf+4, uuid_str+24, 4);
        uuid_int[2] = htonl( strtoul( buf, &endptr, 16 ) );
        if( endptr != buf + 8 ) return 0;

        // fourth 8-bytest
        strncpy(buf, uuid_str+28, 8);
        uuid_int[3] = htonl( strtoul( buf, &endptr, 16 ) );
        if( endptr != buf + 8 ) return 0;

        if( uuid != NULL ) sdp_uuid128_create( uuid, uuid_int );
    } else if ( strlen( uuid_str ) == 8 ) {
        // 32-bit reserved UUID
        uint32_t i = strtoul( uuid_str, &endptr, 16 );
        if( endptr != uuid_str + 8 ) return 0;
        if( uuid != NULL ) sdp_uuid32_create( uuid, i );
    } else if( strlen( uuid_str ) == 4 ) {
        // 16-bit reserved UUID
        int i = strtol( uuid_str, &endptr, 16 );
        if( endptr != uuid_str + 4 ) return 0;
        if( uuid != NULL ) sdp_uuid16_create( uuid, i );
    } else {
        return 0;
    }

    return 1;

}



sdp_session_t *register_service(uint8_t rfcomm_channel) {

    /* A 128-bit number used to identify this service. The words are ordered from most to least
    * significant, but within each word, the octets are ordered from least to most significant.
    * For example, the UUID represneted by this array is 00001101-0000-1000-8000-00805F9B34FB. (The
    * hyphenation is a convention specified by the Service Discovery Protocol of the Bluetooth Core
    * Specification, but is not particularly important for this program.)
    *
    * This UUID is the Bluetooth Base UUID and is commonly used for simple Bluetooth applications.
    * Regardless of the UUID used, it must match the one that the Armatus Android app is searching
    * for.
    */
    const char *service_name = "Armatus Bluetooth server";
    const char *svc_dsc = "A HERMIT server that interfaces with the Armatus Android app";
    const char *service_prov = "Armatus";

    uuid_t root_uuid, l2cap_uuid, rfcomm_uuid, svc_uuid,
           svc_class_uuid;
    sdp_list_t *l2cap_list = 0,
                *rfcomm_list = 0,
                 *root_list = 0,
                  *proto_list = 0,
                   *access_proto_list = 0,
                    *svc_class_list = 0,
                     *profile_list = 0;
    sdp_data_t *channel = 0;
    sdp_profile_desc_t profile;
    sdp_record_t record = { 0 };
    sdp_session_t *session = 0;

    // set the general service ID
    //sdp_uuid128_create(&svc_uuid, &svc_uuid_int);
    _str2uuid("00001101-0000-1000-8000-00805F9B34FB",&svc_uuid);
    sdp_set_service_id(&record, svc_uuid);

    char str[256] = "";
    sdp_uuid2strn(&svc_uuid, str, 256);
    printf("Registering UUID %s\n", str);

    // set the service class
    sdp_uuid16_create(&svc_class_uuid, SERIAL_PORT_SVCLASS_ID);
    svc_class_list = sdp_list_append(0, &svc_class_uuid);
    sdp_set_service_classes(&record, svc_class_list);

    // set the Bluetooth profile information
    sdp_uuid16_create(&profile.uuid, SERIAL_PORT_PROFILE_ID);
    profile.version = 0x0100;
    profile_list = sdp_list_append(0, &profile);
    sdp_set_profile_descs(&record, profile_list);

    // make the service record publicly browsable
    sdp_uuid16_create(&root_uuid, PUBLIC_BROWSE_GROUP);
    root_list = sdp_list_append(0, &root_uuid);
    sdp_set_browse_groups(&record, root_list);

    // set l2cap information
    sdp_uuid16_create(&l2cap_uuid, L2CAP_UUID);
    l2cap_list = sdp_list_append(0, &l2cap_uuid);
    proto_list = sdp_list_append(0, l2cap_list);

    // register the RFCOMM channel for RFCOMM sockets
    sdp_uuid16_create(&rfcomm_uuid, RFCOMM_UUID);
    channel = sdp_data_alloc(SDP_UINT8, &rfcomm_channel);
    rfcomm_list = sdp_list_append(0, &rfcomm_uuid);
    sdp_list_append(rfcomm_list, channel);
    sdp_list_append(proto_list, rfcomm_list);

    access_proto_list = sdp_list_append(0, proto_list);
    sdp_set_access_protos(&record, access_proto_list);

    // set the name, provider, and description
    sdp_set_info_attr(&record, service_name, service_prov, svc_dsc);

    // connect to the local SDP server, register the service record,
    // and disconnect
    session = sdp_connect(&bdaddr_any, &bdaddr_local, SDP_RETRY_IF_BUSY);
    sdp_record_register(session, &record, 0);

    // cleanup
    sdp_data_free(channel);
    sdp_list_free(l2cap_list, 0);
    sdp_list_free(rfcomm_list, 0);
    sdp_list_free(root_list, 0);
    sdp_list_free(access_proto_list, 0);
    sdp_list_free(svc_class_list, 0);
    sdp_list_free(profile_list, 0);

    return session;
}


struct wifi_list{
	char ssid[10];
	char wifi_name[40];
};

char* ST_RTrim(char* s) {
	char t[512];
	char *end;

	strcpy(t, s);
	end = t + strlen(t) - 1;
	while (end != t && isspace(*end))
		end--;
	*(end + 1) = '\0';
	s = t;

	return s;
}

char* ST_LTrim(char *s) {
	char* begin;
	begin = s;

	while(*begin != '\0') {
		if(isspace(*begin))
			begin++;
		else {
			s = begin;
			break;
		}
	}

	return s;
}

char* ST_Trim(char *s) {
	return ST_RTrim(ST_LTrim(s));
}


int init_server() {
    int port = 3, result, sock, client, bytes_read, bytes_sent;
    struct sockaddr_rc loc_addr = { 0 }, rem_addr = { 0 };
    char buffer[1024] = { 0 };
    socklen_t opt = sizeof(rem_addr);

    // local bluetooth adapter
    loc_addr.rc_family = AF_BLUETOOTH;
    loc_addr.rc_bdaddr = bdaddr_any;
    loc_addr.rc_channel = (uint8_t) port;

    // register service
    sdp_session_t *session = register_service(port);
    // allocate socket
    sock = socket(AF_BLUETOOTH, SOCK_STREAM, BTPROTO_RFCOMM);
    printf("socket() returned %d\n", sock);

    // bind socket to port 3 of the first available
    result = bind(sock, (struct sockaddr *)&loc_addr, sizeof(loc_addr));
    printf("bind() on channel %d returned %d\n", port, result);

    // put socket into listening mode
    result = listen(sock, 1);
    printf("listen() returned %d\n", result);

    //sdpRegisterL2cap(port);

    // accept one connection
    printf("calling accept()\n");
    client = accept(sock, (struct sockaddr *)&rem_addr, &opt);
    printf("accept() returned %d\n", client);

    ba2str(&rem_addr.rc_bdaddr, buffer);
    fprintf(stderr, "accepted connection from %s\n", buffer);
    memset(buffer, 0, sizeof(buffer));

    return client;
}

char input[1024] = { 0 };
char *read_server(int client) {
    // read data from the client
    memset(input, 0, 1024*sizeof(char));
    int bytes_read;
    bytes_read = read(client, input, sizeof(input));
    if (bytes_read > 0) {
        printf("received [%s]\n", input);
        return input;
    } else {
        return NULL;
    }
}

void write_server(int client, char *message) {
    // send data to the client
    char messageArr[1024] = { 0 };
    int bytes_sent;
    strcpy(messageArr, message);

    bytes_sent = write(client, messageArr, strlen(messageArr));
    if (bytes_sent > 0) {
        printf("sent [%s] %d\n", messageArr, bytes_sent);
    }
}

int main()
{

		
	system("sudo iw dev wlan0 scan | grep SSID > wifilist.txt");

	char temp[256];
	
	char arr[20][256];
	int i = 0;
	for(i = 0; i < 20; i++) {
		memset(arr[i], 0, 256);
	}	
	FILE* in;
	in = fopen("wifilist.txt", "rt");

	int count = 0;
	while(!feof(in) && count < 20) {
		
		memset(temp, 0, 256);
		if (fgets(temp, 255, in) == NULL) break;

		memcpy(arr[count++], temp, 256);	
	}

	fclose(in);
	system("sudo rm wifilist.txt");
	
	struct wifi_list list[count];

	for(i = 0; i < count; i++) {
		strcpy(arr[i], ST_Trim(arr[i]));
		char *res;
		res = strtok(arr[i], ": ");
		int flag = 0;
		while(res != NULL) {
			if(flag ==0) strcpy(list[i].ssid, res);
			else if(flag == 1) strcpy(list[i].wifi_name, res);

			res = strtok(NULL, ": ");
			flag++;
		}


		printf("%s : %s\n", list[i].ssid, list[i].wifi_name);
		
	}

	int client = init_server();

	int temp_count = 0;

	while(temp_count < count) {
		if (strcmp(list[temp_count].ssid, "SSID") == 0) {
			write_server(client, strcat(list[temp_count].wifi_name, "\n"));
		}
		temp_count++;
	}

	int k;
	while(1) {
		char ssid[256];
		char passwd[256];
		char* recv_message = read_server(client);
		if (recv_message == NULL) {
			printf("client disconnected\n");
			return 0;
		}
	
		char* temp_recv = strtok(recv_message, ":");
		for (k=0; k<=1; k++) {
			if(k==0) strcpy(ssid, temp_recv);
			else if(k == 1) strcpy(passwd, temp_recv);
	
			temp_recv = strtok(NULL, ":");

		}	
		char command[200] = "nmcli device wifi connect ";
		char *com1 = " password ";
		strcat(command, ssid);
		strcat(command, com1);
		k = 0;
		while(passwd[k]) {
			k++;
		}
		passwd[k-1] = '\0';

		strcat(command, passwd);
		strcat(command, " > result.txt 2>&1");
		system(command);
		printf("command:%s\n", command);
		FILE* con_in = fopen("result.txt", "rt");

		char con_temp[256];
		char con_arr[256];
		int con_count = 0;
		memset(con_arr, 0, 256);
		while(!feof(con_in) && con_count < 1) {
			memset(con_temp, 0, 256);
			printf("%s count:%d\n", con_temp, con_count);
			if(fgets(con_temp, 255, con_in) == NULL) break;
			memcpy(con_arr, con_temp, 256);
			con_count++;
		}	
		printf("con_arr:%s\n", con_arr);
		fclose(con_in);
		char* con_ptr = strstr(con_arr, "Error");
		printf("con_ptr:%s\n", con_ptr);
		system("sudo rm result.txt");
	
		if (con_ptr == con_arr) {
			write_server(client, "fail\n");
			k = 0;
		}
		else {
			write_server(client, "connect\n");
			break;
		}
	
	}
	char *recv_message = read_server(client);

	printf("token : %s\n", recv_message);	
	
	char gateway_exec[1024] = "python3.6 client.py ";
	strcat(gateway_exec, recv_message);
	printf("%s\n", gateway_exec);
//	system(gateway_exec);
	FILE *gt = popen(gateway_exec, "r");

	fclose(gt);	

	return 0;

//	while(1)
//	{
//	    char *recv_message = read_server(client);
//	    if ( recv_message == NULL ){
//	        printf("client disconnected\n");
//	        break;
//	    }
//	
//	    printf("%s\n", recv_message);
//	    memset(recv_message, 0, 1024*sizeof(char));
//	}
}
