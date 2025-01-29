// StAuth10244: I Robert Kumar, 000883986, certify that this material is my original work. 
// No other person's work has been used without due acknowledgement. I have not made
//  my work available to anyone else."
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Linking, Modal, Pressable, View, Text } from 'react-native';

export default function Card({ spotifyLink, name, image, followers, genres, id, token }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [albums, setAlbums] = useState([]);

    let url = spotifyLink;
    let artistName = name;
    let followerCount = followers;
    let genreList = genres;
    let artistId = id;
    let accessToken = token;

    /**
     * Basic logic to ensure that an artist is depicted by their first 
     * image, or if an image is missing, a generic spotify logo. 
     */
    let artistPic;
    if (image.length > 0) {
        artistPic = image[0].url;
    } else {
        artistPic = '../assets/spotify.png';
    }

    /**
     * Retrieves the albums for a given artist using Spotify's artists/albums endpoint. 
     * The first 5 albums are returned and stored in an array for further use. 
     */
    async function getAlbums() {
        var searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        };

        await fetch('https://api.spotify.com/v1/artists/' + artistId +'/albums?limit=5', searchParameters)
            .then(response => response.json())
            .then(data => {
                setAlbums(data);
                // console.log(data);
            }
        );
    }

        /**
     * Helper function to call the getAlbums() method once the artist data has been loaded. 
     */
        function handleModalPress() {
            getAlbums();
        }
    
    /**
     * Please note that I adapted the Modal from the reactnative.dev website for my
     * purposes in this app: https://reactnative.dev/docs/modal
     */
    return(
        <View style={styles.card}>
            <View style={styles.imageWrapper}>
                <Image
                    style={styles.image}
                    source={{uri: artistPic}}
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{artistName}</Text>
                        <Text style={styles.modalText}>Followers: {followerCount}</Text>
                        <Text style={styles.modalText}>Albums</Text>
                        {modalVisible && 
                            <FlatList
                                data={albums.items}
                                renderItem={({item}) => (
                                    <Pressable 
                                        style={[styles.buttonAlbum]}
                                        onPress={() => Linking.openURL(item.external_urls.spotify)}
                                    >
                                        <Text style={styles.albumTextStyle}>{item.name}</Text>
                                        <Image
                                            style={styles.albumImage}
                                            source={{uri: item.images[0].url}}
                                        />
                                    </Pressable>
                                )}
                                keyExtractor={(item) => item.id}
                                numColumns={1}
                            />
                        }

                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={[styles.button, styles.buttonSpotify]}
                                onPress={() => Linking.openURL(url)}
                            >
                                <Text style={styles.textStyle}>Open Spotify</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                    setModalVisible(true);
                    handleModalPress();
                }}>
                <Text style={styles.textStyle}>{artistName}</Text>
            </Pressable>
        </View>
    )
}

/**
 * Styles for the Card component.
 */
const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 15,
        margin: 10,
        padding: 10,
        alignItems: 'center',
        backgroundColor: "#DDDDDD",
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 6,
        width: "60vw"
    },
    image: {
        borderRadius: 15,
        width: 200,
        height: 200,
    },
    albumImage: {
        borderRadius: 15,
        width: 50,
        height: 50,
    },
    imageWrapper: {
        borderRadius: 15,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: "80vw"
    },
    buttonContainer: {
        flex: 2,
        flexDirection: 'row'
    },
    button: {
        margin: 10,
        borderRadius: 20,
        padding: 10,
    },
    buttonOpen: {
        backgroundColor: 'darkorange',
    },
    buttonClose: {
        backgroundColor: 'red',
    },
    buttonSpotify: {
        backgroundColor: '#1db954',
    },
    buttonAlbum: {
        flex: 1,
        alignItems: 'center',
        margin: 5,
        borderRadius: 15,
        padding: 10,
        backgroundColor: '#585858',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 30
    },
    modalText: {
        textAlign: 'center',
        fontSize: 20
    },
    albumTextStyle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        padding: 10
    }
});