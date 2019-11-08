from google_images_download import google_images_download # for getting images


def getImagesFromGoogle(search_term, result_amt, pictureFormat, showURLs = True):

    #init the object from the lib
    response = google_images_download.googleimagesdownload()

    #arguments to pass into the download
    args = {
        "keywords": search_term,
        "format": pictureFormat,
        "limit": result_amt,
        "print_urls": showURLs
    }

    paths = ""
    # get the images
    try:
        paths = response.download(args)[0][search_term]
        print(paths)
    except FileNotFoundError:
        print("No files found for: " + str(search_term) + " in google image search.")

    # return the absolute paths to the images in the download folder
    return paths

print(getImagesFromGoogle("sunset", 5, "jpg", showURLs=True))