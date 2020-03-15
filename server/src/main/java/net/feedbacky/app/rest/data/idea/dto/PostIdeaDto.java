package net.feedbacky.app.rest.data.idea.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.feedbacky.app.annotation.base64.Base64;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;

/**
 * @author Plajer
 * <p>
 * Created at 11.10.2019
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PostIdeaDto {

  @NotNull(message = "Field 'discriminator' must represent existing board discriminator.")
  private String discriminator;
  @NotNull(message = "Field 'title' cannot be null.")
  @Length(min = 10, max = 50, message = "Field 'title' cannot be shorter than 10 or longer than 50 characters.")
  private String title;
  @NotNull(message = "Field 'description' cannot be null.")
  @Length(min = 20, max = 1800, message = "Field 'description' cannot be shorter than 20 or longer than 1800 characters.")
  private String description;
  @Base64(maximumKbSize = 1024, mimeType = {"image/png", "image/jpeg"},
      message = "Field 'attachment' must be a valid base64 encoded png image with maximum size of 1 MB.", allowEmpty = true)
  private String attachment;

}