# -*- coding: utf-8 -*- #
# Copyright 2022 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Delete a Cloud NetApp Volume."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from googlecloudsdk.api_lib.netapp.volumes import client as volumes_client
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.netapp.volumes import flags as volumes_flags

from googlecloudsdk.core import log
from googlecloudsdk.core.console import console_io


# TODO(b/239613419):
# Keep gcloud beta netapp group hidden until v1beta1 API stable
# also restructure release tracks that GA \subset BETA \subset ALPHA once
# BETA is public.
@base.Hidden
@base.ReleaseTracks(base.ReleaseTrack.BETA)
class DeleteBeta(base.DeleteCommand):
  """Delete a Cloud NetApp Volume."""

  _RELEASE_TRACK = base.ReleaseTrack.BETA

  @staticmethod
  def Args(parser):
    volumes_flags.AddVolumeDeleteArgs(parser)

  def Run(self, args):
    """Deletes a Cloud NetApp Volume."""
    volume_ref = args.CONCEPTS.volume.Parse()
    if not args.quiet:
      delete_warning = ('You are about to delete a Volume [{}].\n'
                        'Are you sure?'.format(volume_ref.RelativeName()))
      if not console_io.PromptContinue(message=delete_warning):
        return None
    client = volumes_client.VolumesClient(release_track=self._RELEASE_TRACK)
    result = client.DeleteVolume(volume_ref, args.async_, args.force)
    if args.async_:
      command = 'gcloud {} netapp volumes list'.format(
          self.ReleaseTrack().prefix)
      log.status.Print(
          'Check the status of the deletion by listing all volumes:\n  '
          '$ {} '.format(command))
    return result


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class DeleteAlpha(base.DeleteCommand):
  """Delete a Cloud NetApp Volume."""

  _RELEASE_TRACK = base.ReleaseTrack.ALPHA

  @staticmethod
  def Args(parser):
    volumes_flags.AddVolumeDeleteArgs(parser)

  def Run(self, args):
    """Deletes a Cloud NetApp Volume."""
    volume_ref = args.CONCEPTS.volume.Parse()
    if not args.quiet:
      delete_warning = ('You are about to delete a Volume [{}].\n'
                        'Are you sure?'.format(volume_ref.RelativeName()))
      if not console_io.PromptContinue(message=delete_warning):
        return None
    client = volumes_client.VolumesClient(release_track=self._RELEASE_TRACK)
    result = client.DeleteVolume(volume_ref, args.async_, args.force)
    if args.async_:
      command = 'gcloud {} netapp volumes list'.format(
          self.ReleaseTrack().prefix)
      log.status.Print(
          'Check the status of the deletion by listing all volumes:\n  '
          '$ {} '.format(command))
    return result

