package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func ExpandURL(c *gin.Context) {

	rawURL := c.Query("url")

	if rawURL == "" {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Url is required",
			"error":true,
		})
		return
	}

	client := &http.Client{
		CheckRedirect: func(req *http.Request,via []*http.Request) error {
			return nil
		},
	}

	resp, err := client.Get(rawURL)
	if err != nil {
		c.JSON(http.StatusBadRequest,gin.H{
			"message":"Failed to resolve url",
			"error":err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	finalURL := resp.Request.URL.String()

	c.JSON(http.StatusOK,gin.H{
		"original": rawURL,
		"final": finalURL,
	})

}